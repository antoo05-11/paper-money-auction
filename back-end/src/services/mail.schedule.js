import {Auction} from '../models/auction';
import {Bidding} from '../models/bidding';
import cron from 'node-cron';
import {mailService} from "./mail.service";
import {Participation} from "../models/participation";

// Schedule to finalize ended auctions every minute.
export default cron.schedule('* * * * *', () => {
    Auction.find({
        auction_end: {$lte: new Date()},
        winning_bidding: null
    }).then((expiredAuctions) => {
        for (const auction of expiredAuctions) {
            Bidding.findOne({
                auction: auction._id
            }).sort('-price').populate('bidder', 'name email').then((highestBidding) => {
                if (highestBidding) {
                    Auction.findByIdAndUpdate(auction._id, {
                        winning_bidding: highestBidding._id
                    }).populate('auctioneer', 'name email phone').populate('asset', 'name').then((auction) => {
                        console.log(`Server message: Auction ${auction._id} updated with winning bidding ${highestBidding._id}`);

                        // Send mail to winning bidder.
                        const bidder = highestBidding.bidder;
                        const auctioneer = auction.auctioneer;
                        const winningBidding = {
                            price: highestBidding.price,
                            assetName: auction.asset.name,
                            createdAt: highestBidding.createdAt
                        };
                        mailService.sendWinningBidding(bidder.email, bidder, auctioneer, winningBidding).then(() => {
                            console.log(`Server message: Mail sent to notify winning bidding.`);
                        }).catch((e) => {
                            console.log(`Server message: Error: ${e.message}`);
                        });

                        // Send mail to other bidders for deposit reimbursement.
                        Participation.find({bidder: {$ne: bidder._id}, auction: auction._id}).populate('bidder').then(participations => {
                            for (const participation of participations) {
                                const otherBidder = participation.bidder;
                                mailService.sendNotifyReimburseDeposit(otherBidder.email, otherBidder, auctioneer, winningBidding).then(() => {
                                    console.log(`Server message: Mail sent to ${otherBidder._id} for deposit reimbursement.`);
                                }).catch((e) => {
                                    console.log(`Server message: Error: ${e.message}`);
                                    console.log(`Server message: Mail not been sent to ${otherBidder._id} for deposit reimbursement.`);
                                });
                            }
                        })
                    });
                }
            });
        }
    });
});
