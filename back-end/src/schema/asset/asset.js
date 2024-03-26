import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
    id: String,
    ownerId: String,
    attributes: Object,
    status: String,
});

export const Asset = mongoose.model("Asset", assetSchema);