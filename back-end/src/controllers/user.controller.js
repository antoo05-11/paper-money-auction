import userRole from "../constants/user.role";
import { User } from "../models/user";
import { HttpError } from "../utils/http.error";
import bcrypt from "bcrypt";
import errorCode from "../constants/error.code";
import _ from "lodash";

export default class UserController {
    constructor() { }

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

        const payload = _.omit(user._doc, ["password"]);
        res.status(200).json({
            ok: true,
            data: {
                user: payload,
            },
        });
    };

    createAuctioneer = async (req, res) => {
        const { body } = req;
        const { data } = body;

        data.role = userRole.AUCTIONEER;
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

    viewCustomerProfile = async (req, res) => {
        const { params } = req;

        const user = await User.findById(params.id);
        if (!user)
            throw new HttpError({
                ...errorCode.USER.CUSTOMER_NOT_FOUND,
                status: 403,
            });

        const payload = _.pick(user, [
            "_id",
            "name",
            "ssid",
            "email",
            "phone",
            "address",
            "verified",
            "active",
        ]);
        res.status(200).json({
            ok: true,
            data: payload,
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


    updatePassword = async (req, res) => {
        const { user } = req;
        const { data } = req.body;

        if (!bcrypt.compareSync(data.password, user.password))
            throw new HttpError({
                ...errorCode.AUTH.PASSWORD_INVALID,
                status: 400,
            });

        user.password = bcrypt.hashSync(
            data.newPassword,
            bcrypt.genSaltSync(12),
            null
        );

        await user.save();

        res.status(200).json({
            ok: true,
        });
    };

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

    getAllStaff = async (req, res) => {
        const { query } = req;

        const toSortFields = query.sort || null;

        const filter = {
            role: userRole.AUCTIONEER
        };
        const regexFields = ["name", "ssid", "email", "phone"];
        const queryFields = ["active"];
        Object.keys(query).forEach((key) => {
            if (regexFields.includes(key)) {
                filter[key] = { $regex: query[key] };
            } else if (queryFields.includes(key)) {
                filter[key] = query[key];
            }
        });

        let totalStaff = await User.countDocuments(filter);
        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 10;
        let skip = (page - 1) * limit;
        let totalPages = Math.ceil(totalStaff / limit);

        const listStaff = await User.find(filter, "name ssid email phone active")
            .sort(toSortFields)
            .skip(skip)
            .limit(limit);

        const payload = {
            page: page,
            totalPages: totalPages,
            listStaff: listStaff,
        };
        res.status(200).json({
            ok: true,
            data: payload,
        });
    };

    getAllCustomer = async (req, res) => {
        const { query } = req;

        const toSortFields = query.sort || null;

        const filter = {
            role: userRole.CUSTOMER
        };
        const regexFields = ["name", "ssid", "email", "phone"];
        const queryFields = ["active"];
        Object.keys(query).forEach((key) => {
            if (regexFields.includes(key)) {
                filter[key] = { $regex: query[key] };
            } else if (queryFields.includes(key)) {
                filter[key] = query[key];
            }
        });

        let totalCustomer = await User.countDocuments(filter);
        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 10;
        let skip = (page - 1) * limit;
        let totalPages = Math.ceil(totalCustomer / limit);

        const listCustomer = await User.find(filter, "name ssid email phone active")
            .sort(toSortFields)
            .skip(skip)
            .limit(limit);

        const payload = {
            page: page,
            totalPages: totalPages,
            listCustomer: listCustomer,
        };
        res.status(200).json({
            ok: true,
            data: payload,
        });
    };
}
