import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
    {
        // Asset
        asset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset",
        },
        // Auction
        auctioneer: {
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
        max_number_of_bidder: Number,
        docs: [Object],
        // Result
        winning_bidding: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bidding",
        },
        status: String
    },
    {
        versionKey: false,
    }
);

export const Auction = mongoose.model("Auction", auctionSchema);
