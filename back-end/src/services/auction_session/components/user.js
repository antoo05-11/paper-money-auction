import userRole from "../../../constants/user.role";

export class User {
    #joined = false;
    #user = null;
    #alias = '';
    #penalty = false;

    constructor(user, alias) {
        this.#user = user;
        this.#alias = alias;
    }

    getUserId = () =>{
        return this.#user._id.toString();
    }

    setPenalty = (isPenalty) => {
        this.#penalty = isPenalty;
    }

    isPenalty = () => {
        return this.#penalty;
    }

    toString() {
        return `User(alias = ${this.#alias})`
    }

    getJSON = (role) => {
        if (role == null || role === userRole.CUSTOMER) {
            return {
                alias: this.#alias,
                penalty: this.#penalty
            };
        } else {
            return {
                _id: this.#user._id.toString(),
                name: this.#user.name,
                ssid: this.#user.ssid,
                phone: this.#user.phone,
                alias: this.#alias,
                penalty: this.#penalty
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