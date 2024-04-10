import Joi from "joi";
import userRole from "../constants/user.role";
import _ from "lodash";

const roleValues = _.values(userRole);

export default {
    createCustomer: Joi.object({
        email: Joi.string().required(),
        name: Joi.string().required(),
        password: Joi.string().required(),
        ssid: Joi.string().required(),
        phone: Joi.string(),
        address: Joi.string(),
    }).required(),

    createStaff: Joi.object({
        name: Joi.string().required(),
        ssid: Joi.string().required(),
        role: Joi.string()
            .valid(...roleValues)
            .required(),
    }).required(),

    updatePayment: Joi.object({
        bank: Joi.string().required(),
        account_number: Joi.string().required(),
        holder: Joi.string().required(),
    }).required(),

    updateProfile: Joi.object({
        email: Joi.string(),
        name: Joi.string(),
        ssid: Joi.string(),
        phone: Joi.string(),
        address: Joi.string(),
    }).required(),
};
