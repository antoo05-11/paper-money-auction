import Joi from "joi";
import transactionType from "../constants/transaction.type";
import _ from "lodash";

const typeValues = _.values(transactionType);

export default {
    payment: Joi.object({
        type: Joi.string()
            .valid(...typeValues)
            .required(),
        amount: Joi.number().integer().min(0).required(),
    }).required(),
};
