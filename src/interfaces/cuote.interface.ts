import { ObjectId } from "mongoose";

export default interface CuoteInterface {
    _id?: ObjectId
    api?: string;
    date?: Date,
    chars?: number
}