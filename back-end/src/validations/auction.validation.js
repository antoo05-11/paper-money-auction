import Joi from "joi";

export default {
    createAuction: Joi.object({
        asset: Joi.string().required(),
        starting_price: Joi.number().integer().min(0).required(),
        bidding_increment: Joi.number().integer().min(0).required(),
        deposit: Joi.number().integer().min(0).required(),
        registration_open: Joi.date().required(),
        registration_close: Joi.date().required(),
        auction_start: Joi.date().required(),
        auction_end: Joi.date().required(),
        max_number_of_bidder: Joi.number().integer().min(0).required(),
    }).required(),

    confirm: Joi.object({
        confirm: Joi.boolean().required(),
    }).required(),
};
