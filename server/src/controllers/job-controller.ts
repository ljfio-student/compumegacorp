import express from "express";
import { Collection, Db, ObjectId } from "mongodb";
import passport from "passport";
import { IJob, ITaskSelection, IJobProcess, IBlameSelection } from "../models/job";
import { Controller } from "./controller";
import { ITask } from "../models/task";
import { IUser } from "../models/user";
import async, { AsyncQueue } from "async";

const gameLength = 3000000;

export class JobController extends Controller {
    private collection: Collection;
    private queue: AsyncQueue<IJobProcess>;

    constructor(
        router: express.Router,
        private db: Db) {

        super();

        // Setup database collection
        this.collection = db.collection('job');

        // Setup the quue
        this.queue = async.queue(this.handleJobQueue.bind(this), 1);

        // Setup the express routes
        router.get('/job', passport.authenticate('bearer', { session: false }), this.getJobs.bind(this));
        router.get('/job/:id', passport.authenticate('bearer', { session: false }), this.getJob.bind(this));

        router.post('/job', passport.authenticate('bearer', { session: false }), this.createJob.bind(this));

        router.post('/job/:id/task/:taskId', passport.authenticate('bearer', { session: false }), this.joinJob.bind(this));
        router.post('/job/:id/blame/:userId', passport.authenticate('bearer', { session: false }), this.blameUser.bind(this));

        // Load the stagnant jobs into the queue
        this.loadJobsIntoQueue.call(this);
    }

    private getJobs(req: express.Request, res: express.Response) {
        // Checking user is set (a.k.a logged in)
        if (!req.user) {
            return res.status(401).end();
        }

        this.collection.find<IJob>({ expired: false }).toArray()
            .then((jobs) => {
                res.send(jobs).end();
            })
            .catch(this.logAndReportServerError(res));
    }

    private getJob(req: express.Request, res: express.Response) {
        if (!req.user) {
            return res.status(401).end();
        }

        // Get the job the user has requested
        let id = req.params.id;

        // If we have not been provided an id then it is a bad request
        if (id == null) {
            return res.status(400).end();
        }

        this.collection.findOne<IJob>({ _id: new ObjectId(id) })
            .then((job) => {
                if (job != null) {
                    res.send(job).end();
                } else {
                    res.status(404).end(); // We couldn't find the requested job
                }
            })
            .catch(this.logAndReportServerError(res));
    }

    private async blameUser(req: express.Request, res: express.Response) {
        let user = req.user as IUser;

        if (user == null) {
            return res.status(401).end();
        }

        // Get the job the user wants to join
        let id = new ObjectId(req.params.id);

        // If we have not been provided with a valid id then it is a bad request
        if (id == null) {
            return res.status(400).end();
        }

        // Get the user to blame for the task failing
        let userId = new ObjectId(req.params.userId);

        // If we have not been provided with a valid userId then it is a bad request
        if (userId == null) {
            return res.status(400).end();
        }

        // Check that the job exists in the database
        let jobResult = await this.collection.findOne<IJob>({ _id: id });

        if (jobResult == null) {
            return res.status(404).send({ error: "job not found" }).end();
        }

        // Check if he current user has already blamed someone
        if (jobResult.blamed.filter(c => c.userId == user._id).length > 0) {
            return res.status(400).send({ error: "user has already blamed another user " }).end();
        }

        // Check if the user to blame is in the allocations list
        if (jobResult.allocations.filter(c => c.userId == userId).length > 0) {
            return res.status(404).send({ error: "user cannot be blamed as they are not part of the task force" }).end();
        }

        // Add the blame to the job
        let blame = <IBlameSelection>{
            victimId: userId,
            userId: user._id,
        };

        this.collection.updateOne({ _id: id }, { $push: { blamed: blame } })
            .then(result => {
                if (result.modifiedCount == 1) {
                    res.send({ success: true }).end();
                } else {
                    res.status(500).send({ error: "couldn't add blame to job" }).end();
                }
            })
            .catch(this.logAndReportServerError(res));
    }

    private async joinJob(req: express.Request, res: express.Response) {
        let user = req.user as IUser;

        if (user == null) {
            return res.status(401).end();
        }

        // Get the job the user wants to join
        let id = new ObjectId(req.params.id);

        // If we have not been provided with an id then it is a bad request
        if (id == null) {
            return res.status(400).end();
        }

        // Get the task for the job we want to join
        let taskId = new ObjectId(req.params.taskId);

        // If we have not been provided with a taskId then it is a bad request
        if (taskId == null) {
            return res.status(400).end();
        }

        // Check that the job exists in the database
        let jobResult = await this.collection.findOne<IJob>({ _id: id })

        if (jobResult == null) {
            return res.status(404).send({ error: "job not found" }).end();
        }

        // Check that the user hasn't already allocated themselves to a job
        if (jobResult.allocations.filter(c => c.userId.equals(user._id)).length > 0) {
            return res.status(400).send({ error: "user already allocated to a task" }).end();
        }

        // Check that the task was added to the job
        if (jobResult.tasks.filter(c => c.equals(taskId)).length == 0) {
            return res.status(404).send({ error: "task not found on job" }).end();
        }

        let allocation = <ITaskSelection>{
            userId: user._id,
            taskId: taskId,
        };

        this.collection.updateOne({ _id: id }, { $push: { allocations: allocation } })
            .then(result => {
                if (result.modifiedCount == 1) {
                    res.send({ success: true }).end();
                } else {
                    res.status(500).send({ error: "couldn't add allocation to job" }).end();
                }
            })
            .catch(this.logAndReportServerError(res));
    }

    private loadJobsIntoQueue() {
        this.collection.find({ expired: false }, { fields: { _id: 1 } }).toArray()
            .then(result => {
                this.queue.push(result.map(i => { return {id: i._id}; }));
            })
            .catch(error => {
                console.error(error);
            });
    }

    private handleJobQueue(item: IJobProcess, callback: () => void) {
        this.collection.findOne<IJob>({ _id: item.id })
            .then((job) => {
                // Check that we have found a job
                if (job == null) {
                    callback();
                    return;
                }

                // Get the current time and get the difference from when the job was posted
                let now = new Date();
                let difference = Math.abs(job.posted.getTime() - now.getTime());

                // Check that the game length has passed
                if (difference >= gameLength && job.allocations.length > 1 && job.blamed.length == job.allocations.length) {
                    // Select a random task to go wrong
                    let randomTask = job.tasks[Math.random() * job.tasks.length];

                    // Obtain a list of the users working on the task
                    let usersOnTask = job.allocations.filter(t => t.taskId == randomTask).map(t => t.userId);

                    // TODO: Update to use some cool logic
                    let blamedCount = job.blamed
                        .map(b => b.victimId)
                        .reduce((p, c) => {
                            p.set(c, p.has(c) ? (p.get(c)! + 1) : 1);

                            return p;
                        }, new Map<ObjectId, number>());

                    // Obtain the most blamed individuals
                    let maximumBlames = 0;
                    let mostBlamed = Array<ObjectId>();

                    blamedCount.forEach((v, k) => {
                        if (v > maximumBlames) {
                            mostBlamed = [k];
                        } else if (v == maximumBlames) {
                            mostBlamed.push(k);
                        }
                    });

                    // Check to see if any of the most blamed were working on the task
                    let intersection = mostBlamed.filter(b => usersOnTask.indexOf(b) > -1);

                    if (intersection.length > 0) {
                        // Unfortunately the boss has discovered that the users on the task were indeed incompetent
                        usersOnTask.forEach(v => {
                            this.db.collection('user').updateOne({_id : v}, {$inc: {score: -10}});
                        });
                    } else {
                        // The users on the task have got away with it and the most blamed are in trouble
                        mostBlamed.forEach(v => {
                            this.db.collection('user').updateOne({_id : v}, {$inc: {score: -10}});
                        });

                        // The users on the task have their score boosted
                        usersOnTask.forEach(v => {
                            this.db.collection('user').updateOne({_id : v}, {$inc: {score: 10}});
                        });
                    }

                    // Update the game to mark it as expired
                    this.collection.updateOne({ _id: job._id }, { $set: { expired: true } })
                        .then(() => {
                            callback();
                        })
                        .catch(error => {
                            console.error(error);
                            callback();
                        });
                } else {
                    // Add it back into the queue
                    setTimeout(() => {
                        this.queue.push(item);
                    }, 10000);

                    callback();
                }
            })
            .catch(error => {
                console.error(error);
                callback();
            });
    }

    private createJob(req: express.Request, res: express.Response) {
        if (!req.user) {
            return res.status(401).end();
        }

        this.db.collection('task').find({ active: true }, { fields: { _id: 1 } }).toArray()
            .then(ids => {
                // Find a random selection of Tasks to add to the
                let max = ids.length;
                let list = [];

                while (list.length < 4) {
                    let index = Math.floor(Math.random() * max);

                    if (list.indexOf(ids[index]._id) == -1) {
                        list.push(ids[index]._id);
                    }
                }

                // Create a Job in the daabase
                let job = <IJob>{
                    name: "New Job",
                    posted: new Date(),
                    tasks: list,
                    expired: false,
                    allocations: Array<ITaskSelection>(),
                    blamed: Array<IBlameSelection>(),
                };

                this.collection.insertOne(job)
                    .then(result => {
                        if (result.insertedCount == 1) {
                            this.queue.push({ id: result.insertedId });

                            res.send({
                                id: result.insertedId,
                                success: true
                            }).end();
                        }
                    })
                    .catch(this.logAndReportServerError(res));
            })
            .catch(this.logAndReportServerError(res));
    }
}