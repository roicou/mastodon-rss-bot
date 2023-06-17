import { ObjectId } from "mongoose";

export default interface TranslationInterface {
    _id?: ObjectId;
    text?: string;
    translation?: string;
    translator?: string;
}