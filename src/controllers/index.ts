import express from "express";
import mongodb, { Db } from "mongodb";
import { PassportStatic } from "passport";
import { UserController } from "./user-controller";

let setup = (router: express.Router, db: Db, passport: PassportStatic) => {
    new UserController(router, db, passport);
};

export default setup;