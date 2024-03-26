import mongoose from "mongoose";

const auctionSessionSchema = new mongoose.Schema({
    id: String,
    assetId: String,
    last_amount: Number,
    createdTime: Date,
    status: String,
});

export const AuctionSession = mongoose.model("Auction", auctionSessionSchema);