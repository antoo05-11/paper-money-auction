import Joi from "joi";
import errorCode from "../constants/error.code";
import userRole from "../constants/user.role";

class UserValidator {
    toCreateUser = (data) => {
        const roleValues = Object.values(userRole);

        let schema = Joi.object({
            email: Joi.string().required(),
            name: Joi.string().required(),
            password: Joi.string().required(),
            ssid: Joi.string().required(),
            phone: Joi.string(),
            address: Joi.string(),
            role: Joi.string()
                .valid(...roleValues)
                .required(),
        }).required();

        const { error } = schema.validate(data);
        if (error) {
            return {
                ...errorCode.PARAMS_INVALID,
                message: error.details.map((x) => x.message).join(", "),
            };
        }

        return null;
    };

    toUpdatePayment = (data) => {
        let schema = Joi.object({
            bank: Joi.string().required(),
            account_number: Joi.string().required(),
            holder: Joi.string().required(),
        }).required();

        const { error } = schema.validate(data);
        if (error) {
            return {
                ...errorCode.PARAMS_INVALID,
                message: error.details.map((x) => x.message).join(", "),
            };
        }

        return null;
    };

    toUpdateProfile = (data) => {
        let schema = Joi.object({
            email: Joi.string(),
            name: Joi.string(),
            ssid: Joi.string(),
            phone: Joi.string(),
            address: Joi.string(),
        }).required();

        const { error } = schema.validate(data);
        if (error) {
            return {
                ...errorCode.PARAMS_INVALID,
                message: error.details.map((x) => x.message).join(", "),
            };
        }

        return null;
    };
}

export default new UserValidator();
