import ForbiddenInterface from '@/interfaces/forbidden.interface';
import { Schema, model } from 'mongoose';


const ForbiddenModel = new Schema<ForbiddenInterface>({
    text: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model<ForbiddenInterface>('Forbidden', ForbiddenModel);