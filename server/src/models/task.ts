import { ObjectId } from "bson";

export interface ITask {
    _id: ObjectId;
    name: string;
    active: boolean;
}