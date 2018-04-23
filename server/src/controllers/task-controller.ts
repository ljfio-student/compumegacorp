import { Controller } from "./controller";
import { Db, Collection, ObjectId } from "mongodb";
import express from "express";
import passport from "passport";
import { ITask } from "../models/task";
import { IUser } from "../models/user";
import { IJob } from "../models/job";

export class TaskController extends Controller {
    private collection: Collection;

    constructor(
        router: express.Router,
        private db: Db) {

        super();

        // Setup collection database
        this.collection = db.collection('task');

        // Setup the routes
        router.get('/task', passport.authenticate('bearer', { session: false }), this.getTasks.bind(this));
        router.get('/task/:id', passport.authenticate('bearer', { session: false }), this.getTask.bind(this));
        router.post('/task', passport.authenticate('bearer', { session: false }), this.addTask.bind(this));
        router.delete('/task/:id', passport.authenticate('bearer', { session: false }), this.removeTask.bind(this));
    }

    private getTasks(req: express.Request, res: express.Response) {
        if (!req.user) {
            return res.status(401).end();
        }

        this.collection.find<ITask>({ active: true }).toArray()
            .then(response => {
                res.send(response).end();
            })
            .catch(this.logAndReportServerError(res));
    }

    private getTask(req: express.Request, res: express.Response) {
        // Check that we are authetnicatedn
        if (!req.user) {
            return res.status(401).end();
        }

        // Get the ID of the task we are looking to locate
        let id = req.params.id;

        if (id == null) {
            res.status(400).end();
        }

        // Find one task
        this.collection.findOne<ITask>({ _id: new ObjectId(id) })
            .then(task => {
                if (task != null) {
                    res.send(task).end();
                } else {
                    res.status(404).end();
                }
            })
            .catch(this.logAndReportServerError(res));
    }

    private addTask(req: express.Request, res: express.Response) {
        // Check that we are authetnicated and that the user is an admin
        let user = req.user as IUser;

        if (user == null || !user.admin) {
            return res.status(401).end();
        }

        // Check that the request has the name set
        if (req.body == null || req.body.name == null) {
            return res.status(400).end();
        }

        let data = <ITask>{
            name: req.body.name,
            active: true,
        };

        // Insert into the database
        this.collection.insertOne(data)
            .then(done => {
                res.status(201).end();
            })
            .catch(this.logAndReportServerError(res));
    }

    private removeTask(req: express.Request, res: express.Response) {
        // Check that we are authetnicated and that the user is an admin
        let user = req.user as IUser;

        if (user == null || !user.admin) {
            return res.status(401).end();
        }

        // Get the ID for the task that we want to "remove"
        let id = req.param('id');

        if (id == null) {
            return res.status(400).end();
        }

        // Perform the update and check that one has been updated
        this.collection.updateOne({ _id: new ObjectId(id) }, { $set: { active: false } })
            .then(result => {
                if (result.upsertedCount == 1) {
                    res.send({ deleted: true }).end();
                } else {
                    res.status(404).end();
                }
            })
            .catch(this.logAndReportServerError(res));
    }
}