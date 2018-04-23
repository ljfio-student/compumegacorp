import express from "express";
import { Collection, Db, ObjectId } from "mongodb";
import passport from "passport";
import { IJob, IJobSelection } from "../models/job";
import { Controller } from "./controller";
import { ITask } from "../models/task";
import { IUser } from "../models/user";

export class JobController extends Controller {
    private collection: Collection;

    constructor(
        router: express.Router,
        private db: Db) {

        super();

        // Setup database collection
        this.collection = db.collection('job');

        // Setup the express routes
        router.get('/job', passport.authenticate('bearer', { session: false }), this.getJobs.bind(this));
        router.get('/job/:id', passport.authenticate('bearer', { session: false }), this.getJob.bind(this));

        router.post('/job', passport.authenticate('bearer', { session: false }), this.createJob.bind(this));

        router.post('/job/:id/task/:taskId', passport.authenticate('bearer', { session: false }), this.joinJob.bind(this));
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
            return res.status(400).send({ error: "user already allocated to a task"}).end();
        }

        // Check that the task was added to the job
        if (jobResult.tasks.filter(c => c.equals(taskId)).length == 0) {
            return res.status(404).send({ error: "task not found on job" }).end();
        }

        let allocation = <IJobSelection>{
            userId: user._id,
            taskId: taskId,
        };

        this.collection.updateOne({ _id: id }, { $push: { allocations: allocation } })
            .then(result => {
                if (result.modifiedCount == 1) {
                    res.send({ success: true }).end();
                } else {
                    res.status(404).send({ error: "couldn't add allocation to job" }).end();
                }
            })
            .catch(this.logAndReportServerError(res));
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
                    allocations: Array<IJobSelection>()
                };

                this.collection.insertOne(job)
                    .then(result => {
                        res.send({
                            id: result.insertedId,
                            success: result.insertedCount == 1
                        }).end();
                    })
                    .catch(this.logAndReportServerError(res));
            })
            .catch(this.logAndReportServerError(res));
    }
}