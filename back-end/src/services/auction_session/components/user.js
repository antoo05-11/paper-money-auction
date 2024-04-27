import userRole from "../../../constants/user.role";

export class User {
    #joined = false;
    #user = null;
    #alias = '';

    constructor(user, alias) {
        this.#user = user;
        this.#alias = alias;
    }

    getAlias = () => {
        return this.#alias;
    }

    toString() {
        return `User(alias = ${this.#alias})`
    }

    getJSON = (role) => {
        if (role == null || role === userRole.CUSTOMER) {
            return {
                alias: this.#alias
            };
        } else {
            return {
                _id: this.#user._id.toString(),
                name: this.#user.name,
                ssid: this.#user.ssid,
                phone: this.#user.phone,
                alias: this.#alias
            };
        }
    }

    joinSession() {
        this.#joined = true;
    }

    leaveSession() {
        this.#joined = false;
    }
}