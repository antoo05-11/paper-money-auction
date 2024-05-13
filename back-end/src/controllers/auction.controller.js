import { HttpError } from "../utils/http.error";
import errorCode from "../constants/error.code";
import { Auction } from "../models/auction";
import { Asset } from "../models/asset";
import { Participation } from "../models/participation";
import auctionStatus from "../constants/auction.status";
import _, { ceil, parseInt } from "lodash";
import jwt from "jsonwebtoken";
import participationStatus from "../constants/participation.status";
import userRole from "../constants/user.role";
import { Bidding } from "../models/bidding";
import mongoose from "mongoose";
import { writeLogStatus } from "./activity_log.controller";
import { mailService } from "../services/mail.service";
import { ftpService } from "../services/ftp.service";

export default class AuctionController {
    constructor() {}

    createAuction = async (req, res) => {
        const { user } = req;
        const { data } = req.body;

        const asset = await Asset.findById(data.asset);
        if (!asset)
            throw new HttpError({ ...errorCode.ASSET.NOT_FOUND, status: 403 });

        // const uploadedDocs = _.map(req.files["docs"], "originalname"); // Replace this with real files url return from server

        const uploadedDocs = [];
        if (req.files["docs"])
            for (const file of req.files["docs"]) {
                uploadedDocs.push({ name: file.originalname });
            }

        data.docs = uploadedDocs;
        data.auctioneer = user._id;
        data.status = auctionStatus.ONGOING;

        const session = await mongoose.startSession();
        session.startTransaction(); // Start the transaction
        try {
            const auction = (
                await Auction.create([data], { session: session })
            )[0].toObject();

            const nameIdMap = new Map();
            for (const file of auction.docs) {
                nameIdMap.set(file.name, file._id.toString());
            }
            await ftpService.uploadFiles(
                req.files["docs"],
                nameIdMap,
                `${process.env.FTP_PUBLIC_PATH}auction-docs/`
            );

            await session.commitTransaction();
            await session.endSession();

            if (req.activityLog)
                writeLogStatus(req.activityLog, auction._id, true);

            const payload = auction;
            res.status(200).json({
                ok: true,
                data: payload,
                auctionDocRootUrl: `${process.env.FTP_URL}auction-docs/`,
            });
        } catch (e) {
            console.log(e);
            await session.abortTransaction();
            await session.endSession();
            throw new HttpError({
                ...errorCode.INTERNAL_SERVER_ERROR,
                status: 403,
            });
        }
    };

    listAuction = async (req, res) => {
        const { query } = req;

        const pageSize = parseInt(query.page_size || 10);
        const pageIndex = parseInt(query.page || 1);

        const { addFieldsStage, dateMatchFilter, dateSortObject } =
            this.#createFilterForAuction(query);

        // Start find with filter.
        const auctions = await Auction.aggregate([
            addFieldsStage,
            { $match: dateMatchFilter },
            {
                $lookup: {
                    from: "assets",
                    localField: "asset",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { name: { $regex: query.asset || "" } },
                                    {
                                        description: {
                                            $regex: query.asset || "",
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                description: 1,
                                pics: 1,
                            },
                        },
                    ],
                    as: "assets",
                },
            },
            {
                $addFields: {
                    asset: {
                        $cond: {
                            if: { $gt: [{ $size: "$assets" }, 0] },
                            then: { $arrayElemAt: ["$assets", 0] },
                            else: {},
                        },
                    },
                },
            },
            { $match: { assets: { $ne: [] } } },
            { $sort: dateSortObject },

            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    entries: { $push: "$$ROOT" },
                },
            },
            {
                $addFields: {
                    auctions: {
                        $slice: [
                            "$entries",
                            (pageIndex - 1) * pageSize,
                            pageIndex * pageSize,
                        ],
                    },
                },
            },
            {
                $project: {
                    count: 1,
                    auctions: {
                        _id: 1,
                        auction_start: 1,
                        auction_end: 1,
                        registration_open: 1,
                        registration_close: 1,
                        starting_price: 1,
                        asset: 1,
                    },
                },
            },
        ]);

        let payload;
        if (auctions.length === 0) {
            payload = {
                page: pageIndex,
                totalPages: 0,
                auctions: [],
            };
        } else {
            payload = {
                page: pageIndex,
                totalPages: ceil(auctions[0].count / pageSize),
                auctions: auctions[0].auctions,
            };
        }
        return res.status(200).json(payload);
    };

    listRegisteredAuction = async (req, res) => {
        const user = req.user;
        const { query } = req;

        const pageSize = parseInt(query.page_size || 10);
        const pageIndex = parseInt(query.page || 1);

        const { addFieldsStage, dateMatchFilter, dateSortObject } =
            this.#createFilterForAuction(query);

        // Start find with filter.
        const auctions = await Auction.aggregate([
            addFieldsStage,
            { $match: dateMatchFilter },
            {
                $lookup: {
                    from: "participations",
                    as: "participations",
                    localField: "_id",
                    foreignField: "auction",
                    pipeline: [
                        {
                            $match: {
                                bidder: { $eq: user._id },
                            },
                        },
                    ],
                },
            },
            { $match: { participations: { $ne: [] } } },
            {
                $addFields: {
                    participation: {
                        $cond: {
                            if: { $gt: [{ $size: "$participations" }, 0] },
                            then: { $arrayElemAt: ["$participations", 0] },
                            else: {},
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "assets",
                    localField: "asset",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { name: { $regex: query.asset || "" } },
                                    {
                                        description: {
                                            $regex: query.asset || "",
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                description: 1,
                            },
                        },
                    ],
                    as: "assets",
                },
            },
            {
                $addFields: {
                    asset: {
                        $cond: {
                            if: { $gt: [{ $size: "$assets" }, 0] },
                            then: { $arrayElemAt: ["$assets", 0] },
                            else: {},
                        },
                    },
                },
            },
            { $match: { assets: { $ne: [] } } },
            { $sort: dateSortObject },

            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    entries: { $push: "$$ROOT" },
                },
            },
            {
                $addFields: {
                    auctions: {
                        $slice: [
                            "$entries",
                            (pageIndex - 1) * pageSize,
                            pageIndex * pageSize,
                        ],
                    },
                },
            },
            {
                $project: {
                    count: 1,
                    auctions: {
                        _id: 1,
                        auction_start: 1,
                        auction_end: 1,
                        registration_open: 1,
                        registration_close: 1,
                        asset: 1,
                        participation: {
                            verified: 1,
                        },
                    },
                },
            },
        ]);

        let payload;

        if (auctions.length === 0) {
            payload = {
                page: pageIndex,
                totalPages: 0,
                auctions: [],
            };
        } else {
            payload = {
                page: pageIndex,
                totalPages: ceil(auctions[0].count / pageSize),
                auctions: auctions[0].auctions,
            };
        }
        return res.status(200).json(payload);
    };

    listManagingAuction = async (req, res) => {
        const user = req.user;
        const { query } = req;

        let auctioneerId;
        if (user.role === userRole.ADMIN) {
            auctioneerId = query.auctioneer_id;
            if (!auctioneerId) {
                const error = { ...errorCode.LACK_INFO_QUERY };
                error.message +=
                    " Field `auctioneer_id` is required in query package.";
                throw new HttpError({
                    ...error,
                    status: 400,
                });
            }
        } else auctioneerId = user._id;

        console.log(auctioneerId);

        const pageSize = parseInt(query.page_size || 10);
        const pageIndex = parseInt(query.page || 1);

        const { addFieldsStage, dateMatchFilter, dateSortObject } =
            this.#createFilterForAuction(query);

        // Start find with filter.
        const auctions = await Auction.aggregate([
            addFieldsStage,
            { $match: dateMatchFilter },
            {
                $match: {
                    auctioneer: {
                        $eq: new mongoose.Types.ObjectId(auctioneerId),
                    },
                },
            },
            {
                $lookup: {
                    from: "assets",
                    localField: "asset",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { name: { $regex: query.asset || "" } },
                                    {
                                        description: {
                                            $regex: query.asset || "",
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                description: 1,
                            },
                        },
                    ],
                    as: "assets",
                },
            },
            {
                $addFields: {
                    asset: {
                        $cond: {
                            if: { $gt: [{ $size: "$assets" }, 0] },
                            then: { $arrayElemAt: ["$assets", 0] },
                            else: {},
                        },
                    },
                },
            },
            { $match: { assets: { $ne: [] } } },
            { $sort: dateSortObject },

            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    entries: { $push: "$$ROOT" },
                },
            },
            {
                $addFields: {
                    auctions: {
                        $slice: [
                            "$entries",
                            (pageIndex - 1) * pageSize,
                            pageIndex * pageSize,
                        ],
                    },
                },
            },
            {
                $project: {
                    count: 1,
                    auctions: {
                        _id: 1,
                        auction_start: 1,
                        auction_end: 1,
                        registration_open: 1,
                        registration_close: 1,
                        asset: 1,
                    },
                },
            },
        ]);

        let payload = {};

        if (auctions.length === 0) {
            payload = {
                page: pageIndex,
                totalPages: 0,
                auctions: [],
            };
        } else {
            payload = {
                page: pageIndex,
                totalPages: ceil(auctions[0].count / pageSize),
                auctions: auctions[0].auctions,
            };
        }
        return res.status(200).json(payload);
    };

    listOwnedAuction = async (req, res) => {
        const user = req.user;
        const { query } = req;

        console.log(user._id);

        const pageSize = parseInt(query.page_size || 10);
        const pageIndex = parseInt(query.page || 1);

        const { addFieldsStage, dateMatchFilter, dateSortObject } =
            this.#createFilterForAuction(query);

        // Start find with filter.
        const auctions = await Auction.aggregate([
            addFieldsStage,
            { $match: dateMatchFilter },
            {
                $lookup: {
                    from: "assets",
                    localField: "asset",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { name: { $regex: query.asset || "" } },
                                    {
                                        description: {
                                            $regex: query.asset || "",
                                        },
                                    },
                                ],
                                owner: { $eq: user._id.toString() },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                            },
                        },
                    ],
                    as: "assets",
                },
            },
            {
                $addFields: {
                    asset: {
                        $cond: {
                            if: { $gt: [{ $size: "$assets" }, 0] },
                            then: { $arrayElemAt: ["$assets", 0] },
                            else: {},
                        },
                    },
                },
            },
            { $match: { assets: { $ne: [] } } },
            { $sort: dateSortObject },

            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    entries: { $push: "$$ROOT" },
                },
            },
            {
                $addFields: {
                    auctions: {
                        $slice: [
                            "$entries",
                            (pageIndex - 1) * pageSize,
                            pageIndex * pageSize,
                        ],
                    },
                },
            },
            {
                $project: {
                    count: 1,
                    auctions: {
                        _id: 1,
                        auction_start: 1,
                        auction_end: 1,
                        registration_open: 1,
                        registration_close: 1,
                        asset: 1,
                    },
                },
            },
        ]);

        let payload = {};

        if (auctions.length === 0) {
            payload = {
                page: pageIndex,
                totalPages: 0,
                auctions: [],
            };
        } else {
            payload = {
                page: pageIndex,
                totalPages: ceil(auctions[0].count / pageSize),
                auctions: auctions[0].auctions,
            };
        }
        return res.status(200).json(payload);
    };

    viewAuction = async (req, res) => {
        const auctionId = req.params.id;
        const auction = await Auction.findById(auctionId).populate([
            {
                path: "auctioneer",
                select: "name",
            },
            { path: "winning_bidding", select: "price" },
            { path: "asset", select: "name description pics docs" },
        ]);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 400,
            });
        if (req.activityLog) writeLogStatus(req.activityLog, auction._id, true);
        return res.status(200).json(auction);
    };

    viewAuctionActivities = async (req, res) => {
        const user = req.user;
        const auctionId = req.params.id;
        let biddings = [];

        const auction = await Auction.findById(auctionId);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 400,
            });

        if (user.role !== userRole.CUSTOMER) {
            const rawBiddings = await Bidding.aggregate([
                {
                    $match: {
                        auction: new mongoose.Types.ObjectId(auctionId),
                    },
                },
                {
                    $lookup: {
                        from: "participations",
                        let: { bidderId: "$bidder" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$auction",
                                                    new mongoose.Types.ObjectId(
                                                        auctionId
                                                    ),
                                                ],
                                            },
                                            { $eq: ["$bidder", "$$bidderId"] },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    alias: 1,
                                },
                            },
                        ],
                        as: "bidderParticipation",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "bidder",
                        foreignField: "_id",
                        as: "bidderInfo",
                        pipeline: [
                            {
                                $project: {
                                    name: 1,
                                    phone: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $project: {
                        _id: 1,
                        price: 1,
                        createdAt: 1,
                        bidderParticipation: 1,
                        bidderInfo: 1,
                    },
                },
            ]);

            for (let bidding of rawBiddings) {
                bidding = { ...bidding };
                bidding.bidder = {
                    _id: bidding.bidderInfo[0]?._id,
                    name: bidding.bidderInfo[0]?.name,
                    phone: bidding.bidderInfo[0]?.phone,
                    alias: bidding.bidderParticipation[0]?.alias,
                };
                delete bidding.bidderParticipation;
                delete bidding.bidderInfo;
                biddings.push(bidding);
            }
        } else {
            const rawBiddings = await Bidding.aggregate([
                {
                    $match: {
                        auction: new mongoose.Types.ObjectId(auctionId),
                    },
                },
                {
                    $lookup: {
                        from: "participations",
                        let: { bidderId: "$bidder" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$auction",
                                                    new mongoose.Types.ObjectId(
                                                        auctionId
                                                    ),
                                                ],
                                            },
                                            { $eq: ["$bidder", "$$bidderId"] },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    alias: 1,
                                },
                            },
                        ],
                        as: "bidderParticipation",
                    },
                },
                {
                    $project: {
                        price: 1,
                        createdAt: 1,
                        bidderParticipation: 1,
                    },
                },
            ]);

            for (let bidding of rawBiddings) {
                bidding = { ...bidding };
                bidding.bidder = {
                    alias: bidding.bidderParticipation[0]?.alias,
                };
                delete bidding.bidderParticipation;
                biddings.push(bidding);
            }
        }
        if (req.activityLog)
            writeLogStatus(req.activityCode, auction._id, true);
        return res.status(200).json(biddings);
    };

    getParticipationStatus = async (req, res) => {
        const user = req.user;
        const auctionId = req.params.id;

        const auction = await Auction.findById(auctionId);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 400,
            });

        const participation = await Participation.findOne({
            auction: auctionId,
            bidder: user._id,
        });
        if (!participation) {
            return res
                .status(200)
                .json({ status: participationStatus.NOT_REGISTERED_YET });
        }
        if (req.activityLog)
            writeLogStatus(req.activityLog, participation._id, true);
        if (participation.verified)
            return res
                .status(200)
                .json({ status: participationStatus.VERIFIED });
        return res
            .status(200)
            .json({ status: participationStatus.NOT_VERIFIED });
    };

    register = async (req, res) => {
        const user = req.user;
        const auctionId = req.params.id;

        const auction = await Auction.findById(auctionId);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 400,
            });

        // Check valid registration time.
        if (
            auction.registration_open > Date.now() ||
            auction.registration_close < Date.now()
        ) {
            throw new HttpError({
                ...errorCode.AUCTION.NOT_IN_REGISTRATION_TIME,
                status: 400,
            });
        }

        // Check if user registered.
        let participation = await Participation.findOne({
            auction: auctionId,
            bidder: user._id,
        });
        if (participation) {
            throw new HttpError({
                ...errorCode.AUCTION.REGISTERED,
                status: 400,
            });
        }

        // Create a new participation record.
        let num =
            (await Participation.countDocuments({ auction: auctionId })) + 1;
        participation = {
            auction: auctionId,
            bidder: user._id,
            alias: `Bidder ${num}`,
        };
        participation = await Participation.create(participation);

        if (req.activityLog) writeLogStatus(req.activityLog, auction._id, true);

        return res.status(200).json({
            ok: true,
            data: participation,
        });
    };

    joinSession = async (req, res) => {
        const user = req.user;
        const auctionId = req.params.id;

        const auction = await Auction.findById(auctionId).populate(
            "asset",
            "owner"
        );

        let alias = "auctioneer";
        let role = user.role;

        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 400,
            });

        if (
            auction.auction_start - Date.now() > 5 * 60 * 1000 ||
            auction.auction_end < Date.now()
        ) {
            throw new HttpError({
                ...errorCode.AUCTION.NOT_IN_JOINING_TIME,
                status: 400,
            });
        }

        if (user.role === userRole.AUCTIONEER) {
            if (auction.auctioneer.toString() !== user._id.toString()) {
                throw new HttpError({
                    ...errorCode.AUCTION.NOT_AUTHORIZED,
                    status: 400,
                });
            }
        } else if (user.role === userRole.CUSTOMER) {
            const participation = await Participation.findOne({
                bidder: user._id,
                auction: auctionId,
            });
            if (!participation) {
                if (auction.asset.owner.toString() !== user._id.toString()) {
                    throw new HttpError({
                        ...errorCode.AUCTION.NOT_REGISTERED_YET,
                        status: 404,
                    });
                } else {
                    alias = "asset owner";
                    role = userRole.ASSET_OWNER;
                }
            } else {
                if (participation.verified === false) {
                    throw new HttpError({
                        ...errorCode.AUCTION.NOT_REGISTERED_YET,
                        status: 404,
                    });
                }
            }
        }

        if (req.activityLog) writeLogStatus(req.activityLog, auction._id, true);

        const token = jwt.sign(
            { sessionId: auctionId, userId: user._id, role: role },
            process.env.JWT_AUCTION_KEY,
            {
                expiresIn: "1h",
            }
        );
        return res.status(200).json({
            ok: true,
            data: {
                token: `${token}`,
                participation: {
                    alias: alias,
                },
            },
        });
    };

    listBidders = async (req, res) => {
        const auctionId = req.params.id;

        const auction = await Auction.findById(auctionId);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 400,
            });

        const participations = await Participation.find({ auction: auctionId });
        if (req.activityLog) writeLogStatus(req.activityLog, auction._id, true);
        return res.status(200).json({
            ok: true,
            data: participations,
        });
    };

    verifyBidder = async (req, res) => {
        const auctionId = req.params.id || "";
        const bidderId = req.params.bidderId || "";
        const user = req.user;

        const auction = await Auction.findById(auctionId);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 400,
            });
        if (auction.auctioneer.toString() !== user._id.toString()) {
            throw new HttpError({
                ...errorCode.AUCTION.NOT_AUTHORIZED,
                status: 400,
            });
        }

        const participation = await Participation.findOne({
            auction: auctionId,
            bidder: bidderId,
        });
        participation.verified = true;
        await participation.save();

        if (req.activityLog)
            writeLogStatus(req.activityLog, participation._id, true);

        return res.status(200).json({
            ok: true,
            data: participation,
        });
    };

    #createFilterForAuction = (query) => {
        // Create date match query, date sort: Add new date fields without time and compare.
        let dateFields = [
            "auction_start",
            "auction_end",
            "registration_open",
            "registration_close",
        ];
        const dateMatchFilter = {};
        let dateSortObject = { auction_start: -1 };
        dateFields.forEach((field) => {
            if (query[field]) {
                dateMatchFilter[`formatted_${field}`] = { $eq: query[field] };
            }
            if (query[`${field}_sorted`]) {
                dateSortObject = {}; // Sort one field one time.
                dateSortObject[`${field}`] =
                    query[`${field}_sorted`] === "asc" ? 1 : -1;
            }
        });

        const addFieldsStage = {
            $addFields: {},
        };
        dateFields.forEach((field) => {
            addFieldsStage.$addFields[`formatted_${field}`] = {
                $dateToString: { format: "%Y-%m-%d", date: `$${field}` },
            };
        });

        if (query.status) {
            if (query.status === "ON_GOING") {
                dateMatchFilter["auction_start"] = { $lte: new Date() };
                dateMatchFilter["auction_end"] = { $gte: new Date() };
            } else if (query.status === "NOT_STARTED") {
                dateMatchFilter["auction_start"] = { $gte: new Date() };
            } else if (query.status === "ENDED") {
                dateMatchFilter["auction_end"] = { $lte: new Date() };
            }
        }

        return {
            dateMatchFilter: dateMatchFilter,
            addFieldsStage: addFieldsStage,
            dateSortObject: dateSortObject,
        };
    };

    static sendOutcomeMail = (auction) => {
        Bidding.findOne({
            auction: auction._id,
        })
            .sort("-price")
            .populate("bidder", "name email role")
            .then((highestBidding) => {
                if (highestBidding) {
                    Auction.findById(auction._id)
                        .populate("auctioneer", "name email phone")
                        .populate("asset", "name")
                        .then((auction) => {
                            console.log(
                                `Server message: Auction ${auction._id} updated with winning bidding ${highestBidding._id}`
                            );

                            // Send mail to winning bidder.
                            const bidder = highestBidding.bidder;
                            const auctioneer = auction.auctioneer;
                            const winningBidding = {
                                price: highestBidding.price,
                                assetName: auction.asset.name,
                                createdAt: highestBidding.createdAt,
                            };

                            const token = jwt.sign(
                                {
                                    id: bidder._id.toString(),
                                    name: bidder.name,
                                    role: bidder.role,
                                },
                                process.env.SECRET,
                                {
                                    expiresIn: "1d",
                                }
                            );
                            const link = `https://paper-money-auction.vercel.app/item/${auction._id}/${token}`;

                            mailService
                                .sendWinningBidding(
                                    bidder.email,
                                    bidder,
                                    auctioneer,
                                    winningBidding,
                                    link
                                )
                                .then(() => {
                                    console.log(
                                        `Server message: Mail sent to notify winning bidding.`
                                    );
                                })
                                .catch((e) => {
                                    console.log(
                                        `Server message: Error: ${e.message}`
                                    );
                                });

                            // Send mail to other bidders for deposit reimbursement.
                            Participation.find({
                                bidder: { $ne: bidder._id },
                            })
                                .populate("bidder")
                                .then((participations) => {
                                    for (const participation of participations) {
                                        const otherBidder =
                                            participation.bidder;
                                        mailService
                                            .sendNotifyReimburseDeposit(
                                                otherBidder.email,
                                                otherBidder,
                                                auctioneer,
                                                winningBidding
                                            )
                                            .then(() => {
                                                console.log(
                                                    `Server message: Mail sent to ${otherBidder._id} for deposit reimbursement.`
                                                );
                                            })
                                            .catch((e) => {
                                                console.log(
                                                    `Server message: Error: ${e.message}`
                                                );
                                                console.log(
                                                    `Server message: Mail not been sent to ${otherBidder._id} for deposit reimbursement.`
                                                );
                                            });
                                    }
                                });
                        });
                }
            });
    };

    confirmOutcome = async (req, res) => {
        const { data } = req.body;
        const { params } = req;

        let auction = await Auction.findById(params.id);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 403,
            });

        if (data.confirm) {
            const highestBidding = await Bidding.findOne({
                auction: auction._id,
            }).sort("-price");
            auction.winning_bidding = highestBidding._id;
            auction.status = auctionStatus.SUCCEED;
        } else {
            auction.status = auctionStatus.FAILED;
        }

        await auction.save();

        res.status(200).json({
            ok: true,
            data: data,
        });
    };
}
