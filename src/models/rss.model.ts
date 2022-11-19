import RssInterface from '@/interfaces/rss.interface';
import { Schema, model } from 'mongoose';


const RssModel = new Schema<RssInterface>({
    title: {
        type: String,
        required: true,
    },
    hashtag: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    lastUrl: {
        type: String,
        required: false,
    },
    language: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model<RssInterface>('Rss', RssModel);