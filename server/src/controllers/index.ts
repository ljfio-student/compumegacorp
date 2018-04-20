import express from "express";
import mongodb, { Db } from "mongodb";
import { PassportStatic } from "passport";
import { UserController } from "./user-controller";

let setup = (router: express.Router, db: Db) => {
    new UserController(router, db);
};

export default setup;