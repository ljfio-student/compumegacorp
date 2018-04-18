import express from "express";
import { PassportStatic } from "passport";
import { Db, Collection } from "mongodb";
import { IUser, ISimpleUser } from "../models/user";

export class UserController {
    private collection: Collection;

    constructor(
        private router: express.Router,
        private db: Db,
        private passport: PassportStatic)  {

        this.collection = db.collection('user');

        // Setup routes
        router.get('/user/:id?', passport.authenticate('bearer', {session: false}), this.getUser.bind(this));
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