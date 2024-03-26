import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    id: String,
    userId: String,
    verifyNum: Boolean,
    verifyMail: Boolean,
    updateAccount: Boolean,
    makeTransaction: Boolean,
    uploadAsset: Boolean,
    deleteAsset: Boolean,
    uploadPost: Boolean,
    updatePost: Boolean,
    deletePost: Boolean,
    createAuction: Boolean,
    updateAuction: Boolean,
    deleteAuction: Boolean,
    makeOffer: Boolean,
});

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);