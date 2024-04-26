export class User {
    #userId
    #alias = null
    #joined = false

    constructor(userInfo) {
        this.#userId = userInfo.userId;
        this.#alias = userInfo.alias;
    }

    toString() {
        return `User(userId = ${this.#userId}, joined = ${this.#joined})`
    }

    toJSON() {
        return {
            userId: this.#userId
        };
    }

    joinSession() {
        this.#joined = true;
    }

    leaveSession() {
        this.#joined = false;
    }

    getUserId() {
        return this.#userId;
    }
}