import error from "../constants/error.code";
import User from "../models/user";
import { HttpError } from "../utils/http.error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authValidator from "../services/auth.validator";

export default class AuthController {
    constructor() {}
    login = async (req, res) => {
        const { body } = req;
        const data = body.data;
        const data_error = authValidator.login_validate(data);
        if (data_error) throw new HttpError({ ...data_error, status: 400 });

        const user = await User.findOne({
            email: data.email,
        });

        if (!user)
            throw new HttpError({ ...error.AUTH.USER_NOT_FOUND, status: 400 });

        if (!bcrypt.compareSync(data.password, user.password))
            throw new HttpError({
                ...error.AUTH.PASSWORD_INVALID,
                status: 400,
            });

        const payload = {
            email: user.email,
            role: user.role,
        };
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: "1d",
        });

        res.status(200).json({
            data: {
                token: `Bearer ${token}`,
                user: {
                    ...payload,
                },
            },
        });
    };
}
