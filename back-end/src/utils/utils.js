let instance;
import * as crypto from "crypto";

class Utils {
    constructor() {
        if (instance) {
            throw new Error("Utils must be constructed only one time!");
        }
    }

    isNumberInRange = (input, lowerThreshold, upperThreshold) => {
        let number = parseInt(input);
        if (isNaN(number)) {
            return false;
        }
        return number >= lowerThreshold && number <= upperThreshold;
    }
    genNumeralCode = (len) => {
        return crypto.randomInt(0, 10 ** len - 1).toString().padStart(len, "0");
    }
}

export const utils = Object.freeze(new Utils())