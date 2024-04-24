import { HttpError } from "../utils/http.error";
import errorCode from "../constants/error.code";
import { Auction } from "../models/auction";
import { Asset } from "../models/asset";
import { Participation } from "../models/participation";
import auctionStatus from "../constants/auction.status";
import _ from "lodash";

export default class AuctionController {
    constructor() {}
    createAuction = async (req, res) => {
        const { user } = req;
        const { data } = req.body;

        const asset = await Asset.findById(data.asset);
        if (!asset)
            throw new HttpError({ ...errorCode.ASSET.NOT_FOUND, status: 403 });

        data.auctioneer = user._id;
        data.status = auctionStatus.ONGOING;
        const auction = await Auction.create(data);

        const payload = auction;
        res.status(200).json({
            ok: true,
            data: payload,
        });
    };

    uploadDocs = async (req, res) => {
        const { user } = req;
        const { params } = req;

        const auction = await Auction.findById(params.id);
        if (!auction)
            throw new HttpError({
                ...errorCode.AUCTION.NOT_FOUND,
                status: 403,
            });
        if (auction.auctioneer.toString() != user._id.toString())
            throw new HttpError({
                ...errorCode.AUTH.ROLE_INVALID,
                status: 403,
            });

        // TODO: Upload file to server and return files url
        const uploadedDocs = _.map(req.files, "originalname"); // Replace this with real files url return from server

        auction.docs = auction.docs.concat(uploadedDocs);
        await auction.save();

        const payload = auction;
        res.status(200).json({
            ok: true,
            data: payload,
        });
    };

    list_auction = async (req, res) => {};
    list_registered_auction = async (req, res) => {};
    list_managing_auction = async (req, res) => {};
    list_owned_auction = async (req, res) => {};
    view_auction = async (req, res) => {};

    register = async (req, res) => {
        const user = req.user;
        const auctionID = req.params.id;

        const auction = await Auction.findById(auctionID);
        if (!auction)
            throw HttpError({ ...errorCode.AUCTION.NOT_FOUND, status: 400 });

        let num =
            (await Participation.countDocuments({ auction: auction._id })) + 1;
        let participation = {
            auction: auction._id,
            bidder: user._id,
            alias: `Bidder ${num}`,
        };
        await Participation.create(participation);

        const token = jwt.sign(
            { auctionID: auctionID, userID: user._id },
            process.env.JWT_AUCTION_KEY,
            {
                expiresIn: "1h",
            }
        );
        return res.status(200).json({
            data: {
                token: `Bearer ${token}`,
                participation: {
                    alias: participation.alias,
                },
            },
        });
    };

    list_bidder = async (req, res) => {};
    verify_bidder = async (req, res) => {};
}
