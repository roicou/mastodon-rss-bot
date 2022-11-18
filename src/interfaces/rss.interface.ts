import { ObjectId } from "mongoose";

export default interface RssInterface {
    _id?: ObjectId
    title?: string;
    hashtag?: string;
    url?: string;
    lastUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}