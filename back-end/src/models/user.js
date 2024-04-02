import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // Profile
        email: { type: String, unique: true },
        password: String,
        name: String,
        ssid: { type: String, unique: true, sparse: true },
        phone: String,
        address: String,
        // Payment (for User only)
        bank: String,
        account_number: String,
        holder: String,
        // System
        role: String,
        verified: { type: Boolean, default: false },
        active: { type: Boolean, default: true },
    },
    {
        versionKey: false,
    }
);

export const User = mongoose.model("User", userSchema);
