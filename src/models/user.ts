import { ObjectId } from "mongodb";

export interface IUser {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
}

export interface ISimpleUser {
    _id: ObjectId;
    name: string;
}