import { ObjectId } from "bson";

export interface IJob {
    _id: ObjectId;
    name: string;
    expired: boolean;
    posted: Date;
    allocations: IJobSelection[];
    tasks: ObjectId[];
}

export interface IJobSelection {
    userId: ObjectId;
    taskId: ObjectId;
}