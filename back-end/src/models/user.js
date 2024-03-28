import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // Profile
        name: String,
        ssid: { type: String, unique: true },
        password: String,
        role: String,
        phone: { type: String, unique: true },
        email: { type: String, unique: true },
        address: String,
        // Payment (for User only)
        bank: String,
        account_number: String,
        holder: String,
        // System
        verified: { type: Boolean, default: false },
    },
    {
        versionKey: false,
    }
);

export default mongoose.model("User", userSchema);
