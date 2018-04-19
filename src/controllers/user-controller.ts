import express from "express";
import passport from "passport";
import { Db, Collection } from "mongodb";
import bcrypt from "bcrypt";
import { IUser, ISimpleUser, ILoginRequest } from "../models/user";

export class UserController {
    private collection: Collection;

    constructor(
        router: express.Router,
        private db: Db) {

        this.collection = db.collection('user');

        // Setup routes
        router.get('/user/:id?', passport.authenticate('bearer', { session: false }), this.getUser.bind(this));

        // Login routes
        router.post('/user/login', this.loginUser.bind(this));
    }

    private logAndReportServerError(res: express.Response) {
        return (error: Error) => {
            console.error(error);
            res.status(500).send();
        };
    }

    private loginUser(req: express.Request, res: express.Response) {
        let data = req.body as ILoginRequest;

        if (data != null) {
            this.collection.findOne<IUser>({ email: data.email })
                .then((user) => {
                    if (user) {
                        bcrypt.compare(data.password, user.password)
                            .then((match) => {
                                if (match) {

                                } else {

                                }
                            })
                            .catch(this.logAndReportServerError(res));
                    } else {
                        // We couldn't find the specified user
                    }
                })
                .catch(this.logAndReportServerError(res));
        } else {
            res.status(400).end(); // Bad request - was not login request
        }
    }

    private getUser(req: express.Request, res: express.Response) {
        // Check that we are logged in
        if (req.user == null) {
            return res.status(401).end();
        }

        // Get the user parameter
        let id = req.param('id');

        if (id == null) {
            let user = req.user as ISimpleUser;
            res.send(user).end();
        } else {
            this.collection.findOne({_id: id})
                .then((user: ISimpleUser) => {
                    if (user) {
                        res.send(user).end();
                    } else {
                        res.status(404).end();
                    }
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).end();
                });
        }
    }
}