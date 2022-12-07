import { ObjectId } from "mongoose";

export default interface RssInterface {
    _id?: ObjectId
    title?: string;
    hashtag?: string;
    url?: string;
    www?: string;
    lastUrl?: string;
    language?: string;
    createdAt?: Date;
    updatedAt?: Date;
}