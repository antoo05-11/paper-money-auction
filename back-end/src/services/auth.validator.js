import Joi from "joi";
import errorCode from "../constants/error.code";

class AuthValidator {
    login_validate = (data) => {
        let schema = Joi.object({
            email: Joi.string().required(),
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

export default new AuthValidator();
