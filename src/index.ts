import bodyParser from "body-parser";
import express from "express";
import http from "http";
import { format } from "util";
import api from "./api";

let port = process.env.PORT || 8080;

let app = express();
let server = http.createServer(app);

app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile("./public/index.html");
});

app.use('/api/', api);

server.listen(port, () => {
    console.log(format("Listening on port %s", port));
});