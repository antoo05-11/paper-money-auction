import { HttpError } from "../utils/http.error";
import errorCode from "../constants/error.code";
import { Auction } from "../models/auction";
import { Participation } from "../models/participation";

export default class AuctionController {
    constructor() {}
    create_auction = async (req, res) => {};
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
            throw HttpError({ ...errorCode.AUCTION.ID_NOT_FOUND, status: 400 });

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
