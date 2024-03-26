import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    attributes: Object,
    status: String,
}, {
    versionKey: false,
    timestamps: true
});

export default mongoose.model("Asset", assetSchema);