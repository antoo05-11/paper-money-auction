import AuctionController from "../controllers/auction.controller";
import userRole from "../constants/user.role";
import auctionValidation from "../validations/auction.validation";

export default [
    {
        controller: AuctionController,
        methods: [
            // Create Auction
            {
                httpMethod: "post",
                path: "/auction/create",
                method: "createAuction",
                roles: [userRole.AUCTIONEER],
                schema: auctionValidation.createAuction,
            },
            {
                httpMethod: "post",
                path: "/auction/:id/docs",
                method: "uploadDocs",
                roles: [userRole.AUCTIONEER],
                files: "docs",
            },
            {
                httpMethod: "get",
                path: "auction",
                method: "list_auction",
            },
            {
                httpMethod: "get",
                path: "auction/registerd",
                method: "list_registerd_auction",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "get",
                path: "auction/managing",
                method: "list_managing_auction",
                roles: [userRole.AUCTIONEER],
            },
            {
                httpMethod: "get",
                path: "auction/owned",
                method: "list_owned_auction",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "get",
                path: "auction/:id",
                method: "view_auction",
            },
            {
                httpMethod: "post",
                path: "auction/:id/register",
                method: "register",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "get",
                path: "auction/:id/bidder",
                method: "list_bidder",
                roles: [userRole.AUCTIONEER],
            },
            {
                httpMethod: "put",
                path: "auction/:id/bidder",
                method: "verify_bidder",
                roles: [userRole.AUCTIONEER],
            },
        ],
    },
];
