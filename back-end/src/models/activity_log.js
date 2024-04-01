import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifyNum: Boolean,
    verifyMail: Boolean,
    updateAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    makeTransaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    uploadAsset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset'
    },
    deleteAsset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset'
    },
    uploadPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    updatePost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    deletePost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    createAuction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction'
    },
    updateAuction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction'
    },
    deleteAuction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction'
    },
    makeOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    },
}, {
    versionKey: false
});

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);