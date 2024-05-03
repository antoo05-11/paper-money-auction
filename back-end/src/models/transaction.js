import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        auction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
