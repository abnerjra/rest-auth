import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
    },
    available: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    img: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
})

export const CategoryModel = mongoose.model('Category', categorySchema);