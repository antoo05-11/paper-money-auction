import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['admin', 'auctioneer', 'user']
    },
    name: String,
    phone: { type: String, unique: true },
    password: String,
    email: { type: String, unique: true },
    address: String,
    balance: Number,
    verified: { type: Boolean, required: true, default: false }
}, {
    versionKey: false
});

export const User = mongoose.model("User", userSchema);