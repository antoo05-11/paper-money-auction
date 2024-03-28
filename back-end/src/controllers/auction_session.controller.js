import {AuctionSession} from "../models/auction_session";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import errorCode from "../constants/error.code";

export default class AuctionSessionController {
    constructor() {
    }

    enterAuctionRoom = async (req, res) => {
        const user = req.user;
        const roomId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json(errorCode.INVALID_AUCTION_SESSION_ID);
        }
        const auctionSession = await AuctionSession.findById(roomId);

        if (auctionSession) {
            const token = jwt.sign({roomId: roomId, userId: user.userId}, process.env.JWT_AUCTION_KEY, {
                expiresIn: "1h",
            });
            return res.status(200).json({auctionToken: token});
        } else {
            return res.status(400).json(errorCode.INVALID_AUCTION_SESSION_ID);
        }
    }
}