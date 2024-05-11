import { Auction } from "../models/auction";
import { Bidding } from "../models/bidding";
import cron from "node-cron";
import jwt from "jsonwebtoken";
import { mailService } from "./mail.service";
import { Participation } from "../models/participation";

// Schedule to finalize ended auctions every minute.
export default cron.schedule("* * * * *", () => {
    Auction.find({
        auction_end: { $lte: new Date() },
        winning_bidding: null,
    }).then((expiredAuctions) => {
        for (const auction of expiredAuctions) {
            Bidding.findOne({
                auction: auction._id,
            })
                .sort("-price")
                .populate("bidder", "name email role")
                .then((highestBidding) => {
                    if (highestBidding) {
                        Auction.findById(auction._id)
                            .populate("auctioneer", "name email phone")
                            .populate("asset", "name")
                            .then((auction) => {
                                console.log(
                                    `Server message: Auction ${auction._id} updated with winning bidding ${highestBidding._id}`
                                );

                                // Send mail to winning bidder.
                                const bidder = highestBidding.bidder;
                                const auctioneer = auction.auctioneer;
                                const winningBidding = {
                                    price: highestBidding.price,
                                    assetName: auction.asset.name,
                                    createdAt: highestBidding.createdAt,
                                };

                                const token = jwt.sign(
                                    {
                                        id: bidder._id.toString(),
                                        name: bidder.name,
                                        role: bidder.role,
                                    },
                                    process.env.SECRET,
                                    {
                                        expiresIn: "1d",
                                    }
                                );
                                const link = `https://paper-money-auction.vercel.app/auction/${auction._id}/${token}`;

                                mailService
                                    .sendWinningBidding(
                                        bidder.email,
                                        bidder,
                                        auctioneer,
                                        winningBidding,
                                        link
                                    )
                                    .then(() => {
                                        console.log(
                                            `Server message: Mail sent to notify winning bidding.`
                                        );
                                    })
                                    .catch((e) => {
                                        console.log(
                                            `Server message: Error: ${e.message}`
                                        );
                                    });

                                // Send mail to other bidders for deposit reimbursement.
                                Participation.find({
                                    bidder: { $ne: bidder._id },
                                })
                                    .populate("bidder")
                                    .then((participations) => {
                                        for (const participation of participations) {
                                            const otherBidder =
                                                participation.bidder;
                                            mailService
                                                .sendNotifyReimburseDeposit(
                                                    otherBidder.email,
                                                    otherBidder,
                                                    auctioneer,
                                                    winningBidding
                                                )
                                                .then(() => {
                                                    console.log(
                                                        `Server message: Mail sent to ${otherBidder._id} for deposit reimbursement.`
                                                    );
                                                })
                                                .catch((e) => {
                                                    console.log(
                                                        `Server message: Error: ${e.message}`
                                                    );
                                                    console.log(
                                                        `Server message: Mail not been sent to ${otherBidder._id} for deposit reimbursement.`
                                                    );
                                                });
                                        }
                                    });
                            });
                    }
                });
        }
    });
});
