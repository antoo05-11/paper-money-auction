import Joi from "joi";
import errorCode from "../constants/error.code";
import userRole from "../constants/user.role";

class UserValidator {
    signup_validate = (data) => {
        const roleValues = Object.values(userRole);

        let schema = Joi.object({
            email: Joi.string().required(),
            name: Joi.string().required(),
            ssid: Joi.string().required(),
            phone: Joi.string().required(),
            address: Joi.string().required(),
            role: Joi.string().valid(...roleValues),
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
