import express from "express";

let api = express.Router();

api.get('/user', (req: express.Request, res: express.Response) => {
    res.send('hello world').end();
});

export default api;