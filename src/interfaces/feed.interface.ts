import { ObjectId } from "mongoose";

export default interface FeedInterface {
    title: string;
    link: string;
    www: string|null;
    published: string;
    description: string;
    hashtag: string;
    rss: ObjectId;
    language: string;
}