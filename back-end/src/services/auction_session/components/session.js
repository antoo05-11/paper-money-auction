import {User} from "./user";

export class AuctionSession {
    #recentUsers = [];
    #users = new Map();
    #biddings = [];
    #auction;

    static MAX_RECENT_USER = 20;

    constructor(auction, participations) {
        this.#auction = auction;
        for (const participation of participations) {
            this.#users.set(participation.bidder.toString(), new User({
                userId: participation.bidder.toString(),
                alias: participation.alias
            }));
        }
    }

    toString() {
        return `Session(sessionId = ${this.#auction._id}, recentUsers = ${this.#recentUsers})`
    }

    addUser(userId) {
        const user = this.#users.get(userId);
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
}