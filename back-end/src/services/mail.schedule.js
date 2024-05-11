import { Auction } from "../models/auction";
import { Bidding } from "../models/bidding";
import cron from "node-cron";
import jwt from "jsonwebtoken";
import { mailService } from "./mail.service";
import { Participation } from "../models/participation";
import AuctionController from "../controllers/auction.controller";

// Schedule to finalize ended auctions every minute.
export default cron.schedule("* * * * *", () => {
    Auction.find({
        auction_end: { $lte: new Date() },
        winning_bidding: null,
    }).then((expiredAuctions) => {
        for (const auction of expiredAuctions) {
            AuctionController.sendOutcomeMail(auction);
        }
    });
});
