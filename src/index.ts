import bodyParser from "body-parser";
import express from "express";
import http from "http";
import { format } from "util";
import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";

// Setup Express (Static / Body Parser)
let port = process.env.PORT || 8080;

let app = express();
let server = http.createServer(app);

app.use(express.static("public"));
app.use(bodyParser.json());

// Passport authentication
passport.use(new BearerStrategy((token: string, done: (error: any, user: any) => void) => {

}));

// Main index.html page
app.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile("./public/index.html");
});

// Setup the API routes
let api = express.Router();

app.use('/api/', api);

// Start the NodeJS server
server.listen(port, () => {
    console.log(format("Listening on port %s", port));
});