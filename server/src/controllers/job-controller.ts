import express from "express";
import { Collection, Db } from "mongodb";
import passport from "passport";
import { IJob } from "../models/job";
import { Controller } from "./controller";

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
}