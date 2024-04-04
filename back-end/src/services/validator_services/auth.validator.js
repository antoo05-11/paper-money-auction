import Joi from "joi";
import {getValidateResult} from "./validator";

class AuthValidator {
    login_validate = (data) => {
        const schema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        }).required();

        return getValidateResult(schema, data);
    };

    authenticate_validate = (data) => {
        const schema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
            authenticCode: Joi.string().pattern(/^[0-9]{6}$/).required()
        }).required();
        return getValidateResult(schema, data);
    }
}

export const authValidator = Object.freeze(new AuthValidator());