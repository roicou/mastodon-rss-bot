import TranslationInterface from '@/interfaces/translation.interface';
import { Schema, model } from 'mongoose';


const TranslationModel = new Schema<TranslationInterface>({
    text: {
        type: String,
        required: true,
    },
    translation: {
        type: String,
        required: true,
    },
    translator: {
        type: String,
        required: true,
    }
    
}, {
    timestamps: true,
    versionKey: false
});

export default model<TranslationInterface>('Translation', TranslationModel);