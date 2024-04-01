import mongoose from "mongoose";

const biddingSchema = new mongoose.Schema(
    {
        auction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
        },
        bidder: String, // Only need Alias, no need to ref
        price: Number,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Bidding = mongoose.model("Bidding", biddingSchema);
