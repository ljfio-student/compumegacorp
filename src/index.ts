import bodyParser from "body-parser";
import express from "express";
import http from "http";
import { Db, MongoClient, MongoError } from "mongodb";
import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { format } from "util";
import controllers from "./controllers";
import { IUser } from "./models/user";

// Setup Express (Static / Body Parser)
let port = process.env.PORT || 8080;
const databaseUrl: string = "mongodb://127.0.0.1:27017";
const databaseName: string = "hackthecity";

let app = express();
let server = http.createServer(app);

app.use(express.static("public"));
app.use(bodyParser.json());

// Main index.html page
app.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile("./public/index.html");
});

MongoClient.connect(databaseUrl, (error: MongoError, client: MongoClient) => {
    let db: Db = client.db(databaseName);

    // Passport authentication
    passport.use(new BearerStrategy((token: string, done: (error: any, user: any) => void) => {
        db.collection('session').findOne<IUser>({token: token})
            .then((user) => {
                done(null, user);
            })
            .catch((error) => {
                console.error(error);
            });
    }));

    // Setup the API routes
    let api = express.Router();

    // Initialise the controllers
    controllers(api, db, passport);

    app.use('/api/', api);
});

// Start the NodeJS server
server.listen(port, () => {
    console.log(format("Listening on port %s", port));
});