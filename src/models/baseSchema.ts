/**
 * Credit to Mathias Loock for the idea and general structure of this file.
 */

import mongoose from "mongoose";
import { Schema } from "mongoose";

const conversionOptions = {
    virtuals: true,
    versionKey: false,
    /**
     * Executed when toJson or toObject is called on the document.
     * @param {BaseSchema} ret - The plain object representation which has been converted.
     */
    transform: (ret: mongoose.Document) => {
        delete ret._id;
    }
};

const baseSchema = new Schema({}, {
    toJSON: conversionOptions,
    toObject: conversionOptions,
    timestamps: true,
    optimisticConcurrency: true,
}
);

export const BASE_SCHEMA = Object.freeze(baseSchema);