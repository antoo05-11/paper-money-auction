import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    auctionId: String,
    offerorId: String,
    amount: Number,
    createdTime: Date,
});

export const Offer = mongoose.model("Offer", offerSchema);