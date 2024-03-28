import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
    {
        // Asset
        asset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset",
        },
        // Auction
        autioneer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        starting_price: Number,
        bidding_increment: Number,
        deposit: Number,
        registration_open: Date,
        registration_close: Date,
        auction_start: Date,
        auction_end: Date,
        // Result
        winning_bid: Number,
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: String,
    },
    {
        versionKey: false,
    }
);

export const auction = mongoose.model("Auction", auctionSchema);
