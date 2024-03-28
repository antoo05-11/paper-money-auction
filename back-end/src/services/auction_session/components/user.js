export class User {
    #userId
    #socketId
    #roomIds

    constructor(socketId, userId) {
        this.#socketId = socketId;
        this.#userId = userId;
        this.#roomIds = new Set();
    }

    toString() {
        return `User(userId = ${this.#userId}, socketId = ${this.#socketId})`
    }

    joinRoom(roomId) {
        this.#roomIds.add(roomId);
    }

    leaveRoom(roomId) {
        this.#roomIds.delete(roomId);
    }

    getUserRoomIds() {
        return this.#roomIds;
    }

    getUserId() {
        return this.#userId;
    }
}