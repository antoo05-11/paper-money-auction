import Joi from "joi";
import errorCode from "../constants/error.code";

class AuthValidator {
    login_validate = (data) => {
        if (!data) {
            return {
                ...errorCode.PARAMS_INVALID,
                message: "Login data is missing.",
            };
        }

        let schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        });

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

export default new AuthValidator();
