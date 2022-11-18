import CuoteInterface from '@/interfaces/cuote.interface';
import { Schema, model } from 'mongoose';


const CuoteModel = new Schema<CuoteInterface>({
    api: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    chars: { type: Number, required: true }

}, {
    timestamps: true,
    versionKey: false
});


export default model<CuoteInterface>('Cuote', CuoteModel);