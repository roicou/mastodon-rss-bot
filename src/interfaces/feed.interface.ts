import { ObjectId } from "mongoose";
import PostInterface from "./post.interface";

export default interface FeedInterface {
    _id?: ObjectId
    title?: string;
    hashtags?: string[];
    url?: string;
    www_replace?: string;
    language?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastPost?: Date;
    posts?: PostInterface[];
    //post?: PostInterface;
    active?: boolean;
}