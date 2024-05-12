import {User} from "./user";
import {utils} from "../../../utils/utils";
import {Bidding} from "../../../models/bidding";
import errorCode from "../../../constants/error.code";
import {Participation} from "../../../models/participation";

export class AuctionSession {
    #recentUsers = []; // [User]
    #users = new Map(); // [ORM User]
    #biddings = []; // [{User, offer, createdAt}]
    #auction; // ORM Auction.

    static MAX_RECENT_USER = 20;
    static TIME_INTERVAL_BETWEEN_2_BIDDINGS = 2 * 60 * 1000;

    constructor(auction) {
        this.#auction = auction;
        this.#biddings = [];
    }

    init = async () => {
        const auctionId = this.#auction._id.toString();

        const participations = await Participation.find({auction: auctionId})
            .populate('bidder', 'name ssid phone');
        for (const participation of participations) {
            this.#users.set(participation.bidder._id.toString(), new User(participation.bidder, participation.alias));
        }

        this.#users.set(this.#auction.auctioneer._id.toString(), new User(this.#auction.auctioneer, 'Auctioneer'));

        const biddings = await Bidding.find({auction: auctionId});
        for (const bidding of biddings) {
            const userId = bidding.bidder.toString();
            const offer = bidding.price;
            const createdAt = bidding.createdAt;
            this.#biddings.push({
                user: this.#users.get(userId),
                offer: offer,
                createdAt: createdAt
            })
        }
        return this;
    }

    isOnGoing = () => {
        return this.#auction.auction_start < Date.now() && this.#auction.auction_end > Date.now();
    }

    toString = () => {
        return `Session(sessionId = ${this.#auction._id}, recentUsers = ${this.#recentUsers})`
    }

    makeOffer = (userId, offer) => {
        const user = this.#users.get(userId);

        // Get latest offer (not penalty condition).
        let currentMinOffer = this.#auction.starting_price;
        if (this.#biddings.length > 0) {
            if (Date.now() - this.#biddings[this.#biddings.length - 1].createdAt < AuctionSession.TIME_INTERVAL_BETWEEN_2_BIDDINGS)
                return errorCode.AUCTION.BIDDING.TOO_QUICK;
        }
        for (let i = this.#biddings.length - 1; i >= 0; i++) {
            if (!this.#biddings[i].user.isPenalty()) {
                currentMinOffer = this.#biddings[this.#biddings.length - 1].offer + this.#auction.bidding_increment;
                break;
            }
        }

        if (utils.isNumberInRange(offer, currentMinOffer, Number.MAX_SAFE_INTEGER)) {
            this.#biddings.push({user: user, offer: offer, createdAt: Date.now()});
            Bidding.create({
                auction: this.#auction._id,
                bidder: userId,
                price: offer
            }).then((bidding) => {
                if (bidding) {
                    console.log("Status: Make new offer successfully.");
                } else console.log("Database server error: Cannot make new offer.")
            });
            return true;
        } else return errorCode.AUCTION.BIDDING.NOT_BIG_ENOUGH;
    }

    withdrawOffer = (userId) => {
        const user = this.#users.get(userId);
        let madeOfferBefore = false;
        for (const bidding of this.#biddings) {
            if (bidding.user.getUserId() === userId) {
                madeOfferBefore = true;
                break;
            }
        }
        if (!madeOfferBefore) return errorCode.AUCTION.BIDDING.NEVER_MADE_OFFER;
        else {
            user.setPenalty(true);
            Participation.findOneAndUpdate({bidder: userId, auction: this.#auction._id.toString()},
                {penalty: true}).then((participation) => {
                if (participation) {
                    console.log("Status: Set penalty successfully.");
                } else console.log("Database server error: Cannot set penalty.")
            });
            return true;
        }
    }

    addUser = (userId) => {
        if (!this.#users.has(userId)) return false;
        const user = this.#users.get(userId);
        user.joinSession();
        if (!this.#recentUsers.includes(user)) {
            if (this.#recentUsers.length === AuctionSession.MAX_RECENT_USER)
                this.#recentUsers.shift();
            this.#recentUsers.push(user);
        }
        return true;
    }

    removeUser = (userId) => {
        const user = this.#users.get(userId);
        const pos = this.#recentUsers.indexOf(user);
        if (pos > -1) this.#recentUsers.splice(pos, 1);
        user.leaveSession();
    }

    getRecentUsers = (role) => {
        const recentUser = [];
        for (const user of this.#recentUsers) {
            recentUser.push(user.getJSON(role));
        }
        return recentUser;
    }

    getBiddings = (role) => {
        const biddings = [];
        for (const bidding of this.#biddings) {
            biddings.push({
                user: bidding.user.getJSON(role),
                price: bidding.offer,
                createdAt: bidding.createdAt
            });
        }
        console.log(biddings)
        return biddings;
    }

    getBidder = (userId, role) => {
        const user = this.#users.get(userId);
        return user.getJSON(role);
    }
}