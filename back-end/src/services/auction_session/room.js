export class AuctionRoom {
    #roomId
    #userIds
    #recentUserIds

    static MAX_RECENT_USER = 20;

    constructor(roomId) {
        this.#roomId = roomId;
        this.#userIds = new Set();
        this.#recentUserIds = [];
    }
    
    addUser(userId) {
        if (!this.#userIds.has(userId)) {
            if (this.#recentUserIds.length == AuctionRoom.MAX_RECENT_USER)
                this.#recentUserIds.shift();
            this.#recentUserIds.push(userId);
        }
        this.#userIds.add(userId);
    }
    
    removeUser(userId) {
        this.#userIds.delete(userId);
    }
    
    getRoomId() {
        return this.#roomId
    }
    
    getRoomBriefInfo() {
        return this.#recentUserIds;
    }
}