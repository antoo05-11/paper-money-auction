import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset'
    },
    createdTime: Date,
    startTime: Date,
    endTime: Date,
    maxParticipants: Number,
    participantIdList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    requiredFee: Number,
    status: String,
}, {
    versionKey: false,
    timestamps: true
});

export const Post = mongoose.model("Post", postSchema);