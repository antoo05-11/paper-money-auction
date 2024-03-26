import mongoose from "mongoose";

const auctionSessionSchema = new mongoose.Schema({
    assetId: String,
    lastAmount: Number,
    status: {
        type: String,
        enum: [] 
    }
}, {
    versionKey: false,
    timestamps: true
});

export const AuctionSession = mongoose.model("AuctionSession", auctionSessionSchema);