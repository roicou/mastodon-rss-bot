import PostInterface from '@/interfaces/post.interface';
import { Schema, model } from 'mongoose';
import feedModel from './feed.model';


const PostModel = new Schema<PostInterface>({
    feed_id: {
        type: Schema.Types.ObjectId,
        ref: 'Feed',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    published: {
        type: Date,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    posted: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model<PostInterface>('Post', PostModel);