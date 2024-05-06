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
        pics: [{
            name: {
                type: String,
                required: true
            }
        }],
        docs: [{
            name: {
                type: String,
                required: true
            }
        }],
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