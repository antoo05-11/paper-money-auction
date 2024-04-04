import userRole from "../constants/user.role";
import BiddingController from "../controllers/bidding.controller";

export default [
    {
        controller: BiddingController,
        methods: [
            {
                httpMethod: "get",
                path: "auction/:id/bidding",
                method: "view_bidding",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER],
            },
            {
                httpMethod: "post",
                path: "auction/:id/raise",
                method: "raise",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "delete",
                path: "auction/:id/withdraw/:code",
                method: "withdraw",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "put",
                path: "auction/:id/confirm",
                method: "confirm",
                roles: [userRole.CUSTOMER],
            },
        ],
    },
];
