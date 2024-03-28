export class AuctionRoom {
    #roomId
    #recentUsers
    #users

    static MAX_RECENT_USER = 20;

    constructor(roomId) {
        this.#roomId = roomId;
        this.#recentUsers = [];
        this.#users = new Map();
    }

    toString() {
        return `Room(roomId = ${this.#roomId}, recentUsers = ${this.#recentUsers})`
    }

    addUser(user) {
        const userId = user.getUserId();
        user.joinRoom(this.#roomId);
        if (!this.#users.has(userId)) {
            if (this.#recentUsers.length === AuctionRoom.MAX_RECENT_USER)
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

        user.leaveRoom(this.#roomId);
    }

    getRoomId() {
        return this.#roomId;
    }

    getRoomBriefInfo() {
        return this.#recentUsers;
    }
}