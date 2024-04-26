export class User {
    #userId
    #alias = null
    #joined = false

    constructor(userInfo) {
        this.#userId = userInfo.userId;
        this.#alias = userInfo.alias;
    }

    toString() {
        return `User(alias = ${this.#alias})`
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