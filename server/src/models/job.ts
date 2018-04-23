import { ObjectId } from "bson";

export interface IJob {
    _id: ObjectId;
    name: string;
    expired: boolean;
    users: ObjectId[];
}