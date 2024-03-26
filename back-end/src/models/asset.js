import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    attributes: Object,
    status: {
        type: String, 
        enum: ['sold', 'unsold', 'invalid', 'unchecked']
    },
}, {
    versionKey: false,
    timestamps: true
});

export default mongoose.model("Asset", assetSchema);