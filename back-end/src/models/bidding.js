import mongoose from "mongoose";

const biddingSchema = new mongoose.Schema(
    {
        auction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
        },
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
        },
        price: Number,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Bidding = mongoose.model("Bidding", biddingSchema);
