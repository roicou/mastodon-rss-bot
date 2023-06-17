import { ObjectId } from "mongoose";

export default interface ForbiddenInterface {
    _id?: ObjectId;
    text?: string;
}