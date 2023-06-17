import { ObjectId } from "mongoose";
import FeedInterface from "./feed.interface";

export default interface PostInterface {
    _id?: ObjectId
    feed_id?: ObjectId;
    title?: string;
    published?: Date;
    url?: string;
    posted?: boolean;
    feed?: FeedInterface;
}