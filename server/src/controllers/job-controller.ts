import express from "express";
import { Collection, Db, ObjectId } from "mongodb";
import passport from "passport";
import { IJob, IJobSelection } from "../models/job";
import { Controller } from "./controller";
import { ITask } from "../models/task";

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
        let id = req.param('id');

        // If we have not been provided an id then it is a bad request
        if (id == null) {
            return res.status(400).end();
        }

        this.collection.findOne<IJob>({ _id: id })
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
        if (!req.user) {
            return res.status(401).end();
        }

        // Get the job the user wants to join
        let id = req.param('id');

        // If we have not been provided with an id then it is a bad request
        if (id == null) {
            return res.status(400).end();
        }

        // Get the task for the job we want to join
        let taskId = req.param('taskId');

        // If we have not been provided with a taskId then it is a bad request
        if (taskId == null) {
            return res.status(400).end();
        }

        // Check that the job exists in the database
        let jobCount = await this.collection.findOne<IJob>({ _id: id })

        if (jobCount == null) {
            return res.status(404).end();
        }

        // Check that the task was added to the job
        if (jobCount.tasks.indexOf(ObjectId.createFromHexString(taskId)) == -1) {
            return res.status(404).end();
        }

        let allocation = <IJobSelection>{
            userId: req.user._id,
            taskId: ObjectId.createFromHexString(taskId),
        };

        this.collection.updateOne({ _id: id }, { $push: { allocations: allocation } })
            .then(result => {
                if (result.modifiedCount == 1) {
                    res.send({
                        success: true
                    }).end();
                } else {
                    res.status(404).end();
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

                    if (list.indexOf(ids[index]) == -1) {
                        list.push(ids[index]);
                    }
                }

                // Create a Job in the daabase
                let job = <IJob>{
                    name: "New Job",
                    posted: new Date(),
                    tasks: list
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