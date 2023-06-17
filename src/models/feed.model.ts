import FeedInterface from '@/interfaces/feed.interface';
import { Schema, model } from 'mongoose';


const FeedModel = new Schema<FeedInterface>({
    title: {
        type: String,
        required: true,
    },
    hashtags: {
        type: [String],
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    www_replace: {
        type: String,
        required: false,
    },
    language: {
        type: String,
        required: true,
    },
    lastPost: {
        type: Date,
        required: false,
    },
    active: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model<FeedInterface>('Feed', FeedModel);