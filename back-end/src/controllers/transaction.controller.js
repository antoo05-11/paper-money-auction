import { Participation } from "../models/participation";
import { User } from "../models/user";
import { HttpError } from "../utils/http.error";
import errorCode from "../constants/error.code";
import { Transaction } from "../models/transaction";

export default class TransactionController {
    constructor() {}

    checkPayment = async (req, res) => {
        const { params } = req;
        const { query } = req;

        const filter = {};
        if (query.bidder)
            filter.bidder = { $in: await User.find({ email: query.bidder }) };
        if (query.type) filter.type = query.type;

        const deposits = await Transaction.find(filter);

        res.status(200).json({
            ok: true,
            data: deposits,
        });
    };

    pay = async (req, res) => {
        const { user } = req;
        const { data } = req.body;
        const { params } = req;

        const participation = await Participation.findOne({
            auction: params.auctionId,
            bidder: user._id,
        });
        if (!participation)
            throw new HttpError({
                ...errorCode.PARAMS_INVALID,
                message: "You have not registered to the request auction yet.",
                status: 403,
            });

        data.bidder = user._id;
        data.auction = params.auctionId;

        const deposit = await Transaction.create(data);

        res.status(200).json({
            ok: true,
            data: {
                deposit: deposit,
            },
        });
    };
}
