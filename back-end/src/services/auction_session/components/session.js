import {User} from "./user";
import {utils} from "../../../utils/utils";
import {Bidding} from "../../../models/bidding";
import * as assert from "node:assert";
import errorCode from "../../../constants/error.code";

export class AuctionSession {
    #recentUsers = []; // [User]
    #users = new Map(); // [User]
    #biddings = []; // [{User, offer, createdAt}]
    #auction; // ORM Auction.

    static MAX_RECENT_USER = 20;
    static TIME_INTERVAL_BETWEEN_2_BIDDINGS = 2 * 60 * 1000;

    constructor(auction, participations, biddings) {
        console.assert(auction && participations && biddings, "All inputs is required.");
        this.#auction = auction;
        for (const participation of participations) {
            this.#users.set(participation.bidder.toString(), new User({
                userId: participation.bidder.toString(),
                alias: participation.alias
            }));
        }
        for (const bidding of biddings) {
            const userId = bidding.bidder.toString();
            const offer = bidding.price;
            const createdAt = bidding.createdAt;
            this.#biddings.push({user: this.#users.get(userId), offer: offer, createdAt: createdAt})
        }
        console.log(this.#biddings);
    }

    toString() {
        return `Session(sessionId = ${this.#auction._id}, recentUsers = ${this.#recentUsers})`
    }

    makeOffer(userId, offer) {
        const user = this.#users.get(userId);

        // Get latest offer.
        let currentMinOffer = this.#auction.starting_price;
        if (this.#biddings.length > 0) {
            currentMinOffer = this.#biddings[this.#biddings.length - 1].offer + this.#auction.bidding_increment;
            if (Date.now() - this.#biddings[this.#biddings.length - 1].createdAt < AuctionSession.TIME_INTERVAL_BETWEEN_2_BIDDINGS)
                return errorCode.AUCTION.BIDDING.TOO_QUICK;
        }

        if (utils.isNumberInRange(offer, currentMinOffer, Number.MAX_SAFE_INTEGER)) {
            this.#biddings.push({user: user, offer: offer, createdAt: Date.now()});
            Bidding.create({
                auction: this.#auction._id,
                bidder: userId,
                price: offer
            }).then((bidding) => {
                if (bidding) console.log("Status: Make new offer successfully.")
                else console.log("Database server error: Cannot make new offer.")
            });
            return true;
        } else return errorCode.AUCTION.BIDDING.NOT_BIG_ENOUGH;
    }

    addUser(userId) {
        const user = this.#users.get(userId);
        console.log(user)
        user.joinSession();
        if (!this.#recentUsers.includes(user)) {
            if (this.#recentUsers.length === AuctionSession.MAX_RECENT_USER)
                this.#recentUsers.shift();
            this.#recentUsers.push(user);
        }
    }

    removeUser(userId) {
        const user = this.#users.get(userId);
        const pos = this.#recentUsers.indexOf(user);
        if (pos > -1) this.#recentUsers.splice(pos, 1);
        user.leaveSession();
    }

    getSessionBriefInfo() {
        return this.#recentUsers;
    }

    getBiddings() {
        const biddings = [];
        for (const bidding of this.#biddings) {
            biddings.push({alias: bidding.user.alias, price: bidding.offer, createdAt: bidding.create});
        }
        return biddings;
    }
}