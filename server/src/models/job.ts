import { ObjectId } from "bson";

export interface IJob {
    _id: ObjectId;
    expired: boolean;
    users: ObjectId[];
}