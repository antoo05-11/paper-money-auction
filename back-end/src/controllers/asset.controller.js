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

    view = async (req, res) => {};
    list = async (req, res) => {};
}
