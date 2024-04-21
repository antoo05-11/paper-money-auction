export class AuctionSession {
    #sessionId
    #recentUsers
    #users
    #biddings
    #auction

    static MAX_RECENT_USER = 20;

    constructor(sessionId, auction) {
        this.#sessionId = sessionId;
        this.#auction = auction;
        this.#recentUsers = [];
        this.#users = new Map();
        this.#biddings = [];
    }

    toString() {
        return `Session(sessionId = ${this.#sessionId}, recentUsers = ${this.#recentUsers})`
    }

    addUser(user) {
        const userId = user.getUserId();
        user.joinSession(this.#sessionId);
        if (!this.#users.has(userId)) {
            if (this.#recentUsers.length === AuctionSession.MAX_RECENT_USER)
                this.#recentUsers.shift();
            this.#recentUsers.push(user);
        }
        this.#users.set(userId, user);
    }

    removeUser(user) {
        const userId = user.getUserId();

        this.#users.delete(userId);

        const pos = this.#recentUsers.indexOf(user);
        if (pos > -1) this.#recentUsers.splice(pos, 1);

        user.leaveSession(this.#sessionId);
    }

    getSessionId() {
        return this.#sessionId;
    }

    getSessionBriefInfo() {
        return this.#recentUsers;
    }
}