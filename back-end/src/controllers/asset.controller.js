import { Asset } from "../models/asset";
import { User } from "../models/user";
import { HttpError } from "../utils/http.error";
import errorCode from "../constants/error.code";
import _ from "lodash";
import userRole from "../constants/user.role";

export default class AssetController {
    constructor() {}
    createAsset = async (req, res) => {
        const { user } = req;
        const { data } = req.body;

        data.owner = user._id;

        const uploadedPics = _.map(req.files["pics"], "originalname"); // Replace this with real files url return from server
        const uploadedDocs = _.map(req.files["docs"], "originalname"); // Replace this with real files url return from server

        data.pics = uploadedPics;
        data.docs = uploadedDocs;
        const asset = await Asset.create(data);

        const payload = asset;
        res.status(200).json({
            ok: true,
            data: payload,
        });
    };

    viewAsset = async (req, res) => {
        const { user } = req;
        const { params } = req;

        const asset = await Asset.findById(params.id);
        if (!asset)
            throw new HttpError({ ...errorCode.ASSET.NOT_FOUND, status: 403 });
        if (asset.owner.toString() != user._id.toString())
            throw new HttpError({
                ...errorCode.AUTH.ROLE_INVALID,
                status: 403,
            });

        const payload = asset;
        res.status(200).json({
            ok: true,
            data: payload,
        });
    };

    listAsset = async (req, res) => {
        const { user, query } = req;
        const { CUSTOMER, AUCTIONEER, ADMIN } = userRole;

        const filter = {};
        if (user.role === CUSTOMER) {
            filter.owner = user._id;
        } else if (user.role === AUCTIONEER || user.role === ADMIN) {
            if (query.owner)
                filter.owner = { $in: await User.find({ email: query.owner }) };

            if (query.auctioneer && user.role === ADMIN)
                filter.auctioneer = {
                    $in: await User.find({ email: query.auctioneer }),
                };

            if (user.role === AUCTIONEER) filter.auctioneer = user._id;
        }

        const regexFields = ["name", "description"];
        const queryFields = ["verified"];
        Object.keys(query).forEach((key) => {
            if (regexFields.includes(key)) {
                filter[key] = { $regex: query[key] };
            } else if (queryFields.includes(key)) {
                filter[key] = query[key];
            }
        });

        const totalAssets = await Asset.countDocuments(filter);
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalPages = Math.ceil(totalAssets / limit);

        const assets = await Asset.find(filter)
            .sort(query.sort)
            .skip(skip)
            .limit(limit)
            .populate({ path: "owner", select: "email" })
            .populate({ path: "auctioneer", select: "email" });

        const payload = {
            page,
            totalPages,
            assets,
        };

        res.status(200).json({ ok: true, data: payload });
    };
}
