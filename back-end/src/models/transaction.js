import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: []
    },
    last_balance: Number,
    depositRequiredFee: Number,
    postId: String,
    createdTime: Date,
    status: String,
}, {
    versionKey: false
});

export const Transaction = mongoose.model("Transaction", transactionSchema);