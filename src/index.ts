import express from "express";
import http from "http";
import bodyParser from "body-parser";
import { format } from "util";

let port = process.env.PORT || 8080;

let app = express();
let server = http.createServer(app);

app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", (req: express.Request, res: express.Response) => {

});

server.listen(port, () => {
    console.log(format("Listening on port %s", port));
});