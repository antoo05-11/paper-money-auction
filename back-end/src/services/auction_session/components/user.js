export class User {
    #userId
    #socketId
    #sessionIds

    constructor(socketId, userId) {
        this.#socketId = socketId;
        this.#userId = userId;
        this.#sessionIds = new Set();
    }

    toString() {
        return `User(userId = ${this.#userId}, socketId = ${this.#socketId})`
    }

    toJSON() {
        return {
            userId: this.#userId
        };
    }

    joinSession(sessionId) {
        this.#sessionIds.add(sessionId);
    }

    leaveSession(sessionId) {
        this.#sessionIds.delete(sessionId);
    }

    getUserSessionIds() {
        return this.#sessionIds;
    }

    getUserId() {
        return this.#userId;
    }
}