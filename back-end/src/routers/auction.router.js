import AuctionController from "../controllers/auction.controller";
import userRole from "../constants/user.role";
import auctionValidation from "../validations/auction.validation";

export default [
    {
        controller: AuctionController,
        methods: [
            {
                httpMethod: "post",
                path: "/auction",
                method: "createAuction",
                roles: [userRole.AUCTIONEER],
                schema: auctionValidation.createAuction
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
                path: "/auction",
                method: "listAuction",
            },
            {
                httpMethod: "get",
                path: "/auction/registered",
                method: "listRegisteredAuction",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "get",
                path: "/auction/managing",
                method: "listManagingAuction",
                roles: [userRole.AUCTIONEER],
            },
            {
                httpMethod: "get",
                path: "/auction/owned",
                method: "listOwnedAuction",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "get",
                path: "auction/:id",
                method: "view_auction",
            },
            {
                httpMethod: "post",
                path: "/auction/:id/register",
                method: "register",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "get",
                path: "/auction/:id/bidders",
                method: "listBidders",
                roles: [userRole.AUCTIONEER],
            },
            {
                httpMethod: "put",
                path: "/auction/:id/verifyBidder/:bidderId",
                method: "verifyBidder",
                roles: [userRole.AUCTIONEER],
            },
            {
                httpMethod: "get",
                path: "/auction/:id/joinSession",
                method: "joinSession",
                roles: [userRole.AUCTIONEER, userRole.CUSTOMER],
            }
        ],
    },
];
