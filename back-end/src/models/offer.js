import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    auctionId: String,
    offerorId: String,
    amount: Number,
}, {
    timestamps: true,
    versionKey: false
});

export const Offer = mongoose.model("Offer", offerSchema);