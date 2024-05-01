import {Asset} from "../models/asset";
import {Auction} from "../models/auction";
import {User} from "../models/user";
import {HttpError} from "../utils/http.error";
import errorCode from "../constants/error.code";
import _ from "lodash";
import userRole from "../constants/user.role";
import {ftpService} from "../services/ftp.service";
import * as path from "node:path";
import mongoose from "mongoose";

export default class AssetController {
    constructor() {
    }

    createAsset = async (req, res) => {
        const {user} = req;
        const {data} = req.body;

        data.owner = user._id;

        const uploadedDocs = [];
        const uploadedPics = [];

        if (req.files['pics'])
            for (const file of req.files['pics']) {
                uploadedPics.push({name: file.originalname});
            }
        if (req.files['docs'])
            for (const file of req.files['docs']) {
                uploadedDocs.push({name: file.originalname});
            }

        data.pics = uploadedPics;
        data.docs = uploadedDocs;

        const session = await mongoose.startSession();
        session.startTransaction();  // Start the transaction

        try {
            const asset = (await Asset.create([data], {session: session}))[0].toObject();

            const nameIdMap = new Map();
            for (const file of asset.pics) {
                nameIdMap.set(file.name, file._id.toString());
            }
            for (const file of asset.docs) {
                nameIdMap.set(file.name, file._id.toString());
            }

            await ftpService.uploadFiles(req.files["pics"], nameIdMap, `${process.env.FTP_PUBLIC_PATH}asset-docs/`);
            await ftpService.uploadFiles(req.files["docs"], nameIdMap, `${process.env.FTP_PUBLIC_PATH}asset-docs/`);

            await session.commitTransaction();
            await session.endSession();

            return res.status(200).json({
                ok: true,
                data: asset,
                assetDocRootUrl: `${process.env.FTP_URL}asset-docs/`
            });
        } catch (e) {
            console.log(e);
            await session.abortTransaction();
            await session.endSession();
            throw new HttpError({...errorCode.INTERNAL_SERVER_ERROR, status: 403});
        }
    };

    viewAsset = async (req, res) => {
        const {user} = req;
        const {params} = req;

        const asset = (await Asset.findById(params.id)
            .populate({path: "owner", select: "email"})
            .populate({path: "auctioneer", select: "email"}));
        if (!asset)
            throw new HttpError({...errorCode.ASSET.NOT_FOUND, status: 403});
        if (
            user.role === userRole.CUSTOMER &&
            asset.owner._id.toString() !== user._id.toString()
        )
            throw new HttpError({
                ...errorCode.AUTH.ROLE_INVALID,
                status: 403,
            });

        res.status(200).json({
            ok: true,
            data: asset,
            assetDocRootUrl: `${process.env.FTP_URL}asset-docs/`
        });
    };

    listAsset = async (req, res) => {
        const {user, query} = req;
        const {CUSTOMER, AUCTIONEER, ADMIN} = userRole;

        const filter = {};
        if (user.role === CUSTOMER) {
            filter.owner = user._id;
        } else if (user.role === ADMIN) {
            if (query.owner)
                filter.owner = {$in: await User.find({email: query.owner})};

            if (query.auctioneer)
                filter.auctioneer = {
                    $in: await User.find({email: query.auctioneer}),
                };
        } else if (user.role === AUCTIONEER) {
            filter.auctioneer = user._id;
            const pendingAssets = await Auction.find({
                auctioneer: user._id,
            }).select("asset");

            filter._id = {
                $nin: _.map(pendingAssets, "asset"),
            };

            if (query.owner)
                filter.owner = {$in: await User.find({email: query.owner})};
        }

        const regexFields = ["name", "description"];
        const queryFields = ["verified"];
        Object.keys(query).forEach((key) => {
            if (regexFields.includes(key)) {
                filter[key] = {$regex: query[key]};
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
            .populate({path: "owner", select: "email"})
            .populate({path: "auctioneer", select: "email"});

        const payload = {
            page,
            totalPages,
            assets,
            assetDocRootUrl: `${process.env.FTP_URL}asset-docs/`
        };

        res.status(200).json({ok: true, data: payload});
    };

    verifyAsset = async (req, res) => {
        const {params} = req;
        const {data} = req.body;

        const auctioneer = await User.findById(data.auctioneer);
        if (!auctioneer)
            throw new HttpError({
                ...errorCode.USER.AUCTIONEER_NOT_FOUND,
                status: 403,
            });

        const asset = await Asset.findByIdAndUpdate(params.id, data, {
            new: true,
        })
            .populate({path: "owner", select: "email"})
            .populate({path: "auctioneer", select: "email"});
        if (!asset)
            throw new HttpError({...errorCode.ASSET.NOT_FOUND, status: 403});

        res.status(200).json({
            ok: true,
            data: asset,
            assetDocRootUrl: `${process.env.FTP_URL}asset-docs/`
        });
    };
}
