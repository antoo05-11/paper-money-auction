import userRole from "../constants/user.role";
import { User } from "../models/user";
import userValidator from "../services/user.validator";
import { HttpError } from "../utils/http.error";
import bcrypt from "bcrypt";

export default class UserController {
    constructor() {}
    create_customer = async (req, res) => {
        const { body } = req;
        const { data } = body;
        data.role = userRole.CUSTOMER;
        const data_error = userValidator.to_create(data);
        if (data_error) {
            throw new HttpError({ ...data_error, status: 400 });
        }
        data.password = bcrypt.hashSync(
            data.password,
            bcrypt.genSaltSync(12),
            null
        );

        const user = await User.create(data);

        delete user._doc.password;
        res.status(200).json({
            data: {
                user: user,
            },
        });
    };

    create_staff = async (req, res) => {
        const { body } = req;
        const { data } = body;
        const year = new Date().getFullYear() % 100;
        const num_of_staff = (
            await User.countDocuments({
                role: data.role,
            })
        )
            .toString()
            .padStart(3, "0");
        data.email = `${year}${num_of_staff}@vuatiente.vn`;
        data.password = bcrypt.hashSync(
            data.email,
            bcrypt.genSaltSync(12),
            null
        );

        const data_error = userValidator.to_create(data);
        if (data_error) {
            throw new HttpError({ ...data_error, status: 400 });
        }

        const staff = await User.create(data);

        delete staff._doc.password;
        res.status(200).json({
            data: {
                staff: staff,
            },
        });
    };

    view_profile = async (req, res) => {
        const user = req.user;
        res.status(200).json({
            data: {
                user: user,
            },
        });
    };
    update_profile = async (req, res) => {};
    update_password = async (req, res) => {};
    view_payment_method = async (req, res) => {};
    update_payment_method = async (req, res) => {};
}
