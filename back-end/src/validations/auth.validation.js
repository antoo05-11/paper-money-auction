import Joi from "joi";

export default {
    login: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }).required(),

    authenticate: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        authenticCode: Joi.string()
            .pattern(/^[0-9]{6}$/)
            .required(),
    }).required(),

    verify: Joi.object({
        code: Joi.string()
            .pattern(/^[0-9]{6}/)
            .required(),
    }).required(),
};
