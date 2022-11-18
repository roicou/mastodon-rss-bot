import { ObjectId } from "mongoose";

export default interface FeedInterface {
    title: string;
    link: string;
    published: string;
    description: string;
    hashtag: string;
    rss: ObjectId
}