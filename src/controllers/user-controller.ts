import express from "express";
import { PassportStatic } from "passport";
import { Db } from "mongodb";

export class UserController {
    constructor(
        private router: express.Router,
        private db: Db,
        private passport: PassportStatic)  {

        // Setup routes
        router.get('/user', this.getUser.bind(this));
    }

    private getUser(req: express.Request, res: express.Response) {
        res.send('hello world').end();
    }
}