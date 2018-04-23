import bodyParser from "body-parser";
import express from "express";
import http from "http";
import cors from "cors";
import { Db, MongoClient, MongoError } from "mongodb";
import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { format } from "util";
import controllers from "./controllers";
import { IUser, ISession } from "./models/user";

// Setup Express (Static / Body Parser)
let port = process.env.PORT || 8081;
const databaseUrl: string = "mongodb://127.0.0.1:27017";
const databaseName: string = "compumegacorp";

let app = express();
let server = http.createServer(app);

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

// Main index.html page
app.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile("./public/index.html");
});

MongoClient.connect(databaseUrl, (error: MongoError, client: MongoClient) => {
    let db: Db = client.db(databaseName);

    // Passport authentication
    passport.use(new BearerStrategy((token: string, done: (error: any, user?: any) => void) => {
        db.collection('session').findOne<ISession>({ token: token })
            .then((session) => {
                if (session) {
                    db.collection('user').findOne<IUser>({ _id: session.userId })
                        .then((user) => {
                            if (user) {
                                done(null, user); // Found user
                            } else {
                                done(null, false); // Couldn't find user based on session's user ID
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            done(error);
                        });
                } else {
                    done(null, false); // Couldn't find session for user
                }
            })
            .catch((error) => {
                console.error(error);
                done(error);
            });
    }));

    // Setup the API routes
    let api = express.Router();

    // Initialise the controllers
    controllers(api, db);

    app.use('/api/', api);
});

// Start the NodeJS server
server.listen(port, () => {
    console.log(format("Listening on port %s", port));
});