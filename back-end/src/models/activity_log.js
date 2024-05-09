import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    objectId: {
        type: mongoose.Schema.Types.ObjectId
    },
    activityCode: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);