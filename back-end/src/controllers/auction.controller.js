import { HttpError } from "../utils/http.error";
import errorCode from "../constants/error.code";
import { Auction } from "../models/auction";
import { Asset } from "../models/asset";
import { Participation } from "../models/participation";
import auctionStatus from "../constants/auction.status";
import _ from "lodash";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export default class AuctionController {
    constructor() {}

    createAuction = async (req, res) => {
        const { user } = req;
        const { data } = req.body;

        const asset = await Asset.findById(data.asset);
        if (!asset)
            throw new HttpError({ ...errorCode.ASSET.NOT_FOUND, status: 403 });

        const uploadedDocs = _.map(req.files["docs"], "originalname"); // Replace this with real files url return from server

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

    listAuction = async (req, res) => {};
    listRegisteredAuction = async (req, res) => {};
    listManagingAuction = async (req, res) => {};
    listOwnedAuction = async (req, res) => {};
    viewAuction = async (req, res) => {};

    register = async (req, res) => {
        const user = req.user;
        const auctionID = req.params.id;

        const auction = await Auction.findById(auctionID);
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
            auction: auctionID,
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
            (await Participation.countDocuments({ auction: auctionID })) + 1;
        participation = {
            auction: auction._id,
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
        const auctionID = req.params.id;

        const auction = await Auction.findById(auctionID);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 400,
            });

        const participation = await Participation.findOne({
            bidder: user._id,
            auction: auctionID,
        });
        if (!participation) {
            throw new HttpError({
                ...errorCode.AUCTION.NOT_REGISTERED_YET,
                status: 404,
            });
        }

        const token = jwt.sign(
            { auctionID: auctionID, userID: user._id, role: user.role },
            process.env.JWT_AUCTION_KEY,
            {
                expiresIn: "1h",
            }
        );
        return res.status(200).json({
            ok: true,
            data: {
                token: `Bearer ${token}`,
                participation: {
                    alias: participation.alias,
                },
            },
        });
    };

    listBidders = async (req, res) => {
        const auctionID = req.params.id;

        const auction = await Auction.findById(auctionID);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 400,
            });

        const participations = await Participation.find({ auction: auctionID });
        return res.status(200).json({
            ok: true,
            data: participations,
        });
    };

    verifyBidder = async (req, res) => {
        const auctionID = req.params.id || "";
        const bidderId = req.params.bidderId || "";
        const user = req.user;

        const auction = await Auction.findById(auctionID);
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
            auction: auctionID,
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
