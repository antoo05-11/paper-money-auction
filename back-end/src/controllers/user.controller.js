import userRole from "../constants/user.role";
import { User } from "../models/user";
import { userValidator } from "../services/validator_services/user.validator";
import { HttpError } from "../utils/http.error";
import bcrypt from "bcrypt";
import _ from "lodash";

export default class UserController {
    constructor() {}

    createCustomer = async (req, res) => {
        const { body } = req;
        const { data } = body;

        data.role = userRole.CUSTOMER;
        data.password = bcrypt.hashSync(
            data.password,
            bcrypt.genSaltSync(12),
            null
        );
        const user = await User.create(data);

        const payload = _.omit(user, ["password"]);
        res.status(200).json({
            ok: true,
            data: {
                user: payload,
            },
        });
    };

    createStaff = async (req, res) => {
        const { body } = req;
        const { data } = body;

        // Generate email
        const year = new Date().getFullYear() % 100;
        const num_of_staff = (
            await User.countDocuments({
                role: data.role,
            })
        )
            .toString()
            .padStart(3, "0");
        data.email = `${year}${num_of_staff}@vuatiente.vn`;

        // Hash password
        data.password = bcrypt.hashSync(
            data.email,
            bcrypt.genSaltSync(12),
            null
        );

        const staff = await User.create(data);

        const payload = _.omit(staff, ["password"]);
        res.status(200).json({
            data: {
                staff: payload,
            },
        });
    };

    viewProfile = async (req, res) => {
        const payload = req.payload;
        const user = await User.findById(payload.id, {
            _id: 0,
            name: 1,
            ssid: 1,
            email: 1,
            phone: 1,
            address: 1,
            verified: 1,
        });

        res.status(200).json({
            ok: true,
            data: {
                user: user,
            },
        });
    };

    updateProfile = async (req, res) => {
        const { body } = req;
        const { data } = body;
        const payload = req.payload;

        const user = await User.findByIdAndUpdate(payload.id, data, {
            new: true,
        }).select({
            _id: 0,
            name: 1,
            ssid: 1,
            email: 1,
            phone: 1,
            address: 1,
            verified: 1,
        });

        res.status(200).json({
            ok: true,
            data: {
                user: user,
            },
        });
    };

    updatePassword = async (req, res) => {};

    viewPaymentMethod = async (req, res) => {
        const payload = req.payload;
        const user = await User.findById(payload.id, {
            _id: 0,
            bank: 1,
            account_number: 1,
            holder: 1,
        });

        res.status(200).json({
            ok: true,
            data: {
                user: user,
            },
        });
    };

    updatePaymentMethod = async (req, res) => {
        const { body } = req;
        const { data } = body;
        const payload = req.payload;

        const user = await User.findByIdAndUpdate(payload.id, data, {
            new: true,
        }).select({
            _id: 0,
            bank: 1,
            account_number: 1,
            holder: 1,
        });

        res.status(200).json({
            ok: true,
            data: {
                user: user,
            },
        });
    };
}
