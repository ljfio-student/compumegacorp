import express from "express";
import passport from "passport";
import { Db, Collection } from "mongodb";
import bcrypt from "bcrypt";
import { IUser, ISimpleUser, ILoginRequest, ISession, IRegisterRequest } from "../models/user";
import { v4 as uuid } from "uuid";
import { Controller } from "./controller";

export class UserController extends Controller {
    private collection: Collection;
    private sessionCollection: Collection;

    constructor(
        router: express.Router,
        private db: Db) {

        super();

        this.collection = db.collection('user');
        this.sessionCollection = db.collection('session');

        // Setup routes
        router.get('/user/:id?', passport.authenticate('bearer', { session: false }), this.getUser.bind(this));

        // Login routes
        router.post('/user/login', this.loginUser.bind(this));
        router.post('/user/register', this.registerUser.bind(this));
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
                                    var token = uuid();

                                    var session = <ISession>{
                                        userId: user._id,
                                        token: token,
                                    };

                                    this.sessionCollection.insert(session)
                                        .then(() => {
                                            res.send({
                                                authenticated: true,
                                                token: token
                                            }).end();
                                        })
                                        .catch(this.logAndReportServerError(res));
                                } else {
                                    res.status(401).end(); // password doesn't match
                                }
                            })
                            .catch(this.logAndReportServerError(res));
                    } else {
                        res.status(401).end(); // We couldn't find the specified user
                    }
                })
                .catch(this.logAndReportServerError(res));
        } else {
            res.status(400).end(); // Bad request - was not login request
        }
    }

    private async registerUser(req: express.Request, res: express.Response) {
        let data = req.body as IRegisterRequest;

        if (data != null) {
            let usersWithEmail = await this.collection.count({ email: data.email });

            if (usersWithEmail == 0) {
                let password = await bcrypt.hash(data.password, 10);

                let user = <IUser>{
                    name: data.name,
                    email: data.email,
                    password: password,
                };

                this.collection.insertOne(user)
                    .then(() => {
                        res.status(201).send({
                            success: true
                        })
                        .end();
                    })
                    .catch(this.logAndReportServerError(res));
            } else {
                // Already registered with the email address supplied
                res.send({
                    error: "Already registered with email address"
                }).end();
            }
        } else {
            res.status(400).end(); // Bad request - was not a register request
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