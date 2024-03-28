export class User {
    #userId
    #socketId
    #roomIds

    constructor(socketId, userId) {
        this.#socketId = socketId;
        this.#userId = userId;
    }


}