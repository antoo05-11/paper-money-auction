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
    },
    {
        versionKey: false,
    }
);

export default mongoose.model("Asset", assetSchema);
