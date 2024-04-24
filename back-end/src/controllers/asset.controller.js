import { Asset } from "../models/asset";
import { HttpError } from "../utils/http.error";
import errorCode from "../constants/error.code";
import _ from "lodash";

export default class AssetController {
    constructor() {}
    createAsset = async (req, res) => {
        const { user } = req;
        const { data } = req.body;

        data.owner = user._id;
        const asset = await Asset.create(data);

        const payload = asset;
        res.status(200).json({
            ok: true,
            data: payload,
        });
    };

    uploadPics = async (req, res) => {
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

        // TODO: Upload file to server and return files url
        const uploadedPics = _.map(req.files, "originalname"); // Replace this with real files url return from server

        asset.pics = asset.pics.concat(uploadedPics);
        await asset.save();

        const payload = asset;
        res.status(200).json({
            ok: true,
            data: payload,
        });
    };

    uploadDocs = async (req, res) => {
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

        // TODO: Upload file to server and return files url
        const uploadedDocs = _.map(req.files, "originalname"); // Replace this with real files url return from server

        asset.docs = asset.docs.concat(uploadedDocs);
        await asset.save();

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
        const { user } = req;
        const { query } = req;

        const toSortFields = query.sort || null;

        const filter = {
            owner: user._id,
        };
        const regexFields = ["name", "description"];
        const queryFields = ["verified"];
        Object.keys(query).forEach((key) => {
            if (regexFields.includes(key)) {
                filter[key] = { $regex: query[key] };
            } else if (queryFields.includes(key)) {
                filter[key] = query[key];
            }
        });

        let totalAssets = await Asset.countDocuments(filter);
        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 10;
        let skip = (page - 1) * limit;
        let totalPages = Math.ceil(totalAssets / limit);

        const assets = await Asset.find(filter)
            .sort(toSortFields)
            .skip(skip)
            .limit(limit);

        const payload = {
            page: page,
            totalPages: totalPages,
            assets: assets,
        };
        res.status(200).json({
            ok: true,
            data: payload,
        });
    };
}
