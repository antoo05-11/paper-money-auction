import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        // Information
        name: String,
        description: String,
        pics: [String],
        // Verification
        docs: [String],
        verified: {
            type: Boolean,
            default: false,
        },
        auctioneer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        versionKey: false,
    }
);

export const Asset = mongoose.model("Asset", assetSchema);
