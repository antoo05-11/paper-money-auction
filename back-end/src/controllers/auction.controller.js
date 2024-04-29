import {HttpError} from '../utils/http.error';
import errorCode from '../constants/error.code';
import {Auction} from '../models/auction';
import {Asset} from '../models/asset';
import {Participation} from '../models/participation';
import auctionStatus from '../constants/auction.status';
import _, {ceil, parseInt} from 'lodash';
import jwt from 'jsonwebtoken';
import participationStatus from '../constants/participation.status';
import userRole from '../constants/user.role';
import {Bidding} from '../models/bidding';
import mongoose from 'mongoose';
import {User} from "../models/user";

export default class AuctionController {
    constructor() {
    }

    createAuction = async (req, res) => {
        const {user} = req;
        const {data} = req.body;

        const asset = await Asset.findById(data.asset);
        if (!asset)
            throw new HttpError({...errorCode.ASSET.NOT_FOUND, status: 403});

        const uploadedDocs = _.map(req.files['docs'], 'originalname'); // Replace this with real files url return from server

        data.docs = uploadedDocs;
        data.auctioneer = user._id;
        data.status = auctionStatus.ONGOING;
        const auction = await Auction.create(data);

        const payload = auction;
        res.status(200).json({
            ok: true,
            data: payload,
        });
    };

    listAuction = async (req, res) => {
        const {query} = req;

        const pageSize = parseInt(query.page_size || 10);
        const pageIndex = parseInt(query.page || 1);

        // Create date match query, date sort: Add new date fields without time and compare.
        let dateFields = ['auction_start', 'auction_end', 'registration_open', 'registration_close'];
        const dateMatchFilter = {};
        let dateSortObject = {'auction_start': -1};
        dateFields.forEach(field => {
            if (query[field]) {
                dateMatchFilter[`formatted_${field}`] = {$eq: query[field]};
            }
            if (query[`${field}_sorted`]) {
                dateSortObject = {}; // Sort one field one time.
                dateSortObject[`${field}`] = query[`${field}_sorted`] === 'asc' ? 1 : -1;
            }
        });

        const addFieldsStage = {
            $addFields: {}
        };
        dateFields.forEach(field => {
            addFieldsStage.$addFields[`formatted_${field}`] = {
                $dateToString: {format: "%Y-%m-%d", date: `$${field}`},
            };
        });

        if (query.status) {
            if (query.status === "ON_GOING") {
                dateMatchFilter['auction_start'] = {$lte: new Date()};
                dateMatchFilter['auction_end'] = {$gte: new Date()};
            } else if (query.status === "NOT_STARTED") {
                dateMatchFilter['auction_start'] = {$gte: new Date()};
            } else if (query.status === "ENDED") {
                dateMatchFilter['auction_end'] = {$lte: new Date()};
            }
        }

        // Start find with filter.
        const auctions = await Auction.aggregate([
            addFieldsStage,
            {$match: dateMatchFilter},
            {
                $lookup: {
                    from: 'assets',
                    localField: 'asset',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $match: {
                                $or: [{name: {$regex: query.asset || ''}},
                                    {description: {$regex: query.asset || ''}}]
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1
                            }
                        }
                    ],
                    as: 'assets'
                }
            },
            {
                $addFields: {
                    asset: {
                        $cond: {
                            if: {$gt: [{$size: "$assets"}, 0]},
                            then: {$arrayElemAt: ["$assets", 0]},
                            else: {}
                        }
                    }
                }
            },
            {$match: {assets: {$ne: []}}},
            {$sort: dateSortObject},

            {
                $group: {
                    _id: null,
                    count: {$sum: 1},
                    entries: {$push: "$$ROOT"}
                }
            }, {
                $addFields: {
                    auctions: {
                        $slice: ['$entries', (pageIndex - 1) * pageSize, pageIndex * pageSize]
                    }
                }
            },
            {
                $project: {
                    count: 1,
                    auctions: {
                        auction_start: 1,
                        auction_end: 1,
                        registration_open: 1,
                        registration_close: 1,
                        asset: 1
                    }
                }
            }
        ]);

        let payload = {};

        if (auctions.length === 0) {
            payload = {
                page: pageIndex,
                totalPages: 0,
                auctions: []
            };
        } else {
            payload = {
                page: pageIndex,
                totalPages: ceil(auctions[0].count / pageSize),
                auctions: auctions[0].auctions
            };
        }
        return res.status(200).json(payload)
    };

    listRegisteredAuction = async (req, res) => {
        const user = req.user;
        const {query} = req;

        const pageSize = parseInt(query.page_size || 10);
        const pageIndex = parseInt(query.page || 1);

        // Create date match query, date sort: Add new date fields without time and compare.
        let dateFields = ['auction_start', 'auction_end', 'registration_open', 'registration_close'];
        const dateMatchFilter = {};
        let dateSortObject = {'auction_start': -1};
        dateFields.forEach(field => {
            if (query[field]) {
                dateMatchFilter[`formatted_${field}`] = {$eq: query[field]};
            }
            if (query[`${field}_sorted`]) {
                dateSortObject = {}; // Sort one field one time.
                dateSortObject[`${field}`] = query[`${field}_sorted`] === 'asc' ? 1 : -1;
            }
        });

        const addFieldsStage = {
            $addFields: {}
        };
        dateFields.forEach(field => {
            addFieldsStage.$addFields[`formatted_${field}`] = {
                $dateToString: {format: "%Y-%m-%d", date: `$${field}`},
            };
        });

        if (query.status) {
            if (query.status === "ON_GOING") {
                dateMatchFilter['auction_start'] = {$lte: new Date()};
                dateMatchFilter['auction_end'] = {$gte: new Date()};
            } else if (query.status === "NOT_STARTED") {
                dateMatchFilter['auction_start'] = {$gte: new Date()};
            } else if (query.status === "ENDED") {
                dateMatchFilter['auction_end'] = {$lte: new Date()};
            }
        }

        // Start find with filter.
        const auctions = await Auction.aggregate([
            addFieldsStage,
            {$match: dateMatchFilter},
            {
                $lookup: {
                    from: 'participations',
                    as: 'participations',
                    localField: '_id',
                    foreignField: 'auction',
                    pipeline: [
                        {
                            $match: {
                                bidder: {$eq: user._id}
                            }
                        }
                    ]
                }
            },
            {$match: {participations: {$ne: []}}},
            {
                $addFields: {
                    participation: {
                        $cond: {
                            if: {$gt: [{$size: "$participations"}, 0]},
                            then: {$arrayElemAt: ["$participations", 0]},
                            else: {}
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'assets',
                    localField: 'asset',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $match: {
                                $or: [{name: {$regex: query.asset || ''}},
                                    {description: {$regex: query.asset || ''}}]
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1
                            }
                        }
                    ],
                    as: 'assets'
                }
            },
            {
                $addFields: {
                    asset: {
                        $cond: {
                            if: {$gt: [{$size: "$assets"}, 0]},
                            then: {$arrayElemAt: ["$assets", 0]},
                            else: {}
                        }
                    }
                }
            },
            {$match: {assets: {$ne: []}}},
            {$sort: dateSortObject},

            {
                $group: {
                    _id: null,
                    count: {$sum: 1},
                    entries: {$push: "$$ROOT"}
                }
            }, {
                $addFields: {
                    auctions: {
                        $slice: ['$entries', (pageIndex - 1) * pageSize, pageIndex * pageSize]
                    }
                }
            },
            {
                $project: {
                    count: 1,
                    auctions: {
                        auction_start: 1,
                        auction_end: 1,
                        registration_open: 1,
                        registration_close: 1,
                        asset: 1,
                        participation: {
                            verified: 1
                        }
                    }
                }
            }
        ]);

        const payload = {
            page: pageIndex,
            totalPages: ceil(auctions[0].count / pageSize),
            auctions: auctions[0].auctions
        };
        return res.status(200).json(payload)
    };

    listManagingAuction = async (req, res) => {
        const user = req.user;
        const auctions = await Auction.find({auctioneer: user._id,}).populate([{
            path: 'asset',
            select: 'name'
        }, {path: 'winning_bidding', select: 'price'}])
        return res.status(200).json(auctions);
    };

    listOwnedAuction = async (req, res) => {
        const user = req.user;

    };


    viewAuction = async (req, res) => {
        const auctionId = req.params.id;
        const auction = await Auction.findById(auctionId).populate([{
            path: 'auctioneer',
            select: 'name'
        }, {path: 'winning_bidding', select: 'price'}]);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 400,
            });
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
                        auction: new mongoose.Types.ObjectId(auctionId)
                    }
                },
                {
                    $lookup: {
                        from: 'participations',
                        let: {bidderId: '$bidder'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {$eq: ['$auction', new mongoose.Types.ObjectId(auctionId)]},
                                            {$eq: ['$bidder', '$$bidderId']}
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    alias: 1
                                }
                            }
                        ],
                        as: 'bidderParticipation'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'bidder',
                        foreignField: '_id',
                        as: 'bidderInfo',
                        pipeline: [
                            {
                                $project: {
                                    name: 1,
                                    phone: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $project: {
                        price: 1,
                        createdAt: 1,
                        bidderParticipation: 1,
                        bidderInfo: 1
                    }
                }
            ]);

            for (let bidding of rawBiddings) {
                bidding = {...bidding}
                bidding.bidder = {
                    _id: bidding.bidderInfo[0]?._id,
                    name: bidding.bidderInfo[0]?.name,
                    phone: bidding.bidderInfo[0]?.phone,
                    alias: bidding.bidderParticipation[0]?.alias
                }
                delete bidding.bidderParticipation
                delete bidding.bidderInfo
                biddings.push(bidding);
            }
        } else {
            const rawBiddings = await Bidding.aggregate([
                {
                    $match: {
                        auction: new mongoose.Types.ObjectId(auctionId)
                    }
                },
                {
                    $lookup: {
                        from: 'participations',
                        let: {'bidderId': '$bidder'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {$eq: ['$auction', new mongoose.Types.ObjectId(auctionId)]},
                                            {$eq: ['$bidder', '$$bidderId']}
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    alias: 1
                                }
                            }
                        ],
                        as: 'bidderParticipation'
                    }
                },
                {
                    $project: {
                        price: 1,
                        createdAt: 1,
                        bidderParticipation: 1
                    }
                }
            ])

            for (let bidding of rawBiddings) {
                bidding = {...bidding}
                bidding.bidder = {
                    alias: bidding.bidderParticipation[0]?.alias
                }
                delete bidding.bidderParticipation
                biddings.push(bidding);
            }
        }
        return res.status(200).json(biddings);
    }

    getParticipationStatus = async (req, res) => {
        const user = req.user;
        const auctionId = req.params.id;

        const auction = await Auction.findById(auctionId);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 400,
            });

        const participation = await Participation.findOne({auction: auctionId, bidder: user._id});
        if (!participation) {
            return res.status(200).json({status: participationStatus.NOT_REGISTERED_YET});
        }
        if (participation.verified)
            return res.status(200).json({status: participationStatus.VERIFIED});
        return res.status(200).json({status: participationStatus.NOT_VERIFIED});
    }

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
        let num = (await Participation.countDocuments({auction: auctionId})) + 1;
        participation = {
            auction: auctionId,
            bidder: user._id,
            alias: `Bidder ${num}`,
        };
        participation = await Participation.create(participation);

        return res.status(200).json({
            ok: true,
            data: participation,
        });
    };

    joinSession = async (req, res) => {
        const user = req.user;
        const auctionId = req.params.id;

        const auction = await Auction.findById(auctionId);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 400,
            });

        const participation = await Participation.findOne({
            bidder: user._id,
            auction: auctionId,
        });
        if (!participation) {
            throw new HttpError({
                ...errorCode.AUCTION.NOT_REGISTERED_YET,
                status: 404,
            });
        }
        if (participation.verified === false) {
            throw new HttpError({
                ...errorCode.AUCTION.NOT_REGISTERED_YET,
                status: 404,
            });
        }

        const token = jwt.sign(
            {auctionId: auctionId, userID: user._id, role: user.role},
            process.env.JWT_AUCTION_KEY,
            {
                expiresIn: '1h',
            }
        );
        return res.status(200).json({
            ok: true,
            data: {
                token: `Bearer ${token}`,
                participation: {
                    alias: participation.alias,
                }
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

        const participations = await Participation.find({auction: auctionId});
        return res.status(200).json({
            ok: true,
            data: participations,
        });
    };

    verifyBidder = async (req, res) => {
        const auctionId = req.params.id || '';
        const bidderId = req.params.bidderId || '';
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

        return res.status(200).json({
            ok: true,
            data: participation,
        });
    };
}
