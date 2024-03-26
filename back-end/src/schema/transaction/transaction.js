import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    id: String,
    userId: String,
    type: String,
    last_balance: Number,
    depositRequiredFee: Number,
    postId: String,
    createdTime: Date,
    status: String,
}, {
    versionKey: false
});

export const Transaction = mongoose.model("Transaction", transactionSchema);