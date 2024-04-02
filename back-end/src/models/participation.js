import mongoose from "mongoose";

const ParticipationSchema = new mongoose.Schema(
    {
        auction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
        },
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        alias: { type: String, unique: true },
        verified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Participation = mongoose.model("Participation", ParticipationSchema);