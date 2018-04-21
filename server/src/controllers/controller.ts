import express from "express";

export class Controller {
    protected logAndReportServerError(res: express.Response) {
        return (error: Error) => {
            console.error(error);
            res.status(500).send();
        };
    }
}