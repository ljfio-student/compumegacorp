import express from "express";
import mongodb, { Db } from "mongodb";
import { PassportStatic } from "passport";
import { UserController } from "./user-controller";
import { JobController } from "./job-controller";
import { TaskController } from "./task-controller";

let setup = (router: express.Router, db: Db, io: SocketIO.Server) => {
    new UserController(router, db);
    new JobController(router, db);
    new TaskController(router, db);

    io.on('connection', (socket) => {
        socket.join('chat');

        socket.on('message', (message) => {
            io.to('chat').emit('message', message);
        });
    });
};

export default setup;