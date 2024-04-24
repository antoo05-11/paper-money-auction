import Joi from "joi";

export default {
    createAsset: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
};
