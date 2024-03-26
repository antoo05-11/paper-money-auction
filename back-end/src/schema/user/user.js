import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: String,
    role: String,
    name: String,
    phone: { type: String, unique: true },
    password: String,
    email: { type: String, unique: true },
    address: String,
    balance: Number,
});

export default mongoose.model("User", userSchema);