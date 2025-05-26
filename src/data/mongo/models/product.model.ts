import mongoose, { Schema } from "mongoose";
import { ref } from "process";

const productSchema = new Schema({
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
    price: {
        type: Number,
        required: [true, 'Price is required'],
        default: 0,
    },
    img: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category ID is required'],
    },
})

export const ProductModel = mongoose.model('Product', productSchema);