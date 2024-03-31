import Joi from "joi";
import errorCode from "../constants/error.code";

class UserValidator {
    signup_validate = (data) => {
        let schema = Joi.object({
            email: Joi.string().required(),
            name: Joi.string().required(),
            ssid: Joi.string().required(),
            phone: Joi.string().required(),
            address: Joi.string().required(),
            password: Joi.string().required(),
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
