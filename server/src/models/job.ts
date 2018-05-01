import { ObjectId } from "bson";

export interface IJob {
    _id: ObjectId;
    name: string;
    expired: boolean;
    posted: Date;
    allocations: ITaskSelection[];
    tasks: ObjectId[];
}

export interface ITaskSelection {
    userId: ObjectId;
    taskId: ObjectId;
}

export interface IJobProcess {
    id: ObjectId;
}