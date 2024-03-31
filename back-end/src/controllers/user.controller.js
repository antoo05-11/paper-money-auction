import userRole from "../constants/user.role";
import User from "../models/user";
import userValidator from "../services/user.validator";
import { HttpError } from "../utils/http.error";
import bcrypt from "bcrypt";

export default class UserController {
    constructor() {}
    create_customer = async (req, res) => {
        const { body } = req;
        const { data } = body;
        const data_error = userValidator.signup_validate(data);
        if (data_error) {
            throw new HttpError({ ...data_error, status: 400 });
        }

        data.password = bcrypt.hashSync(
            data.password,
            bcrypt.genSaltSync(12),
            null
        );
        data.role = userRole.CUSTOMER;
        const customer = await User.create(data);

        delete customer._doc.password;
        res.status(200).json({
            data: {
                customer: customer,
            },
        });
    };

    view_profile = async (req, res) => {};
    update_profile = async (req, res) => {};
    update_password = async (req, res) => {};
    view_payment_method = async (req, res) => {};
    update_payment_method = async (req, res) => {};
}
