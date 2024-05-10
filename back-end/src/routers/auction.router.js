import AuctionController from "../controllers/auction.controller";
import userRole from "../constants/user.role";
import auctionValidation from "../validations/auction.validation";
import activityCode from "../constants/activity.code";
import objectClass from "../constants/object.class";

export default [
    {
        controller: AuctionController,
        methods: [
            {
                httpMethod: "post",
                path: "/auction",
                method: "createAuction",
                roles: [userRole.AUCTIONEER],
                verified: true,
                schema: auctionValidation.createAuction,
                files: [{ name: "docs", maxCount: 3 }],
                initialLog: {
                    activityCode: activityCode.AUCTION.CREATE,
                    objectClass: objectClass.AUCTION
                }
            },
            {
                httpMethod: "get",
                path: "/auction",
                method: "listAuction",
                initialLog: {
                    activityCode: activityCode.AUCTION.GET_LIST,
                    success: true,
                    objectClass: objectClass.AUCTION
                }
            },
            {
                httpMethod: "get",
                path: "/auction/registered",
                method: "listRegisteredAuction",
                roles: [userRole.CUSTOMER],
                verified: true,
                initialLog: {
                    activityCode: activityCode.AUCTION.GET_LIST,
                    success: true,
                    objectClass: objectClass.AUCTION
                }
            },
            {
                httpMethod: "get",
                path: "/auction/managing",
                method: "listManagingAuction",
                roles: [userRole.AUCTIONEER, userRole.ADMIN],
                initialLog: {
                    activityCode: activityCode.AUCTION.GET_LIST,
                    success: true,
                    objectClass: objectClass.AUCTION
                }
            },
            {
                httpMethod: "get",
                path: "/auction/owned",
                method: "listOwnedAuction",
                roles: [userRole.CUSTOMER],
                initialLog: {
                    activityCode: activityCode.AUCTION.GET_LIST,
                    success: true,
                    objectClass: objectClass.AUCTION
                }
            },
            {
                httpMethod: "get",
                path: "/auction/:id",
                method: "viewAuction",
                // initialLog: {
                //     activityCode: activityCode.AUCTION.GET_BY_ID,
                //     objectClass: objectClass.AUCTION
                // }
            },
            {
                httpMethod: "get",
                path: "/auction/:id/activities",
                method: "viewAuctionActivities",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER],
                initialLog: {
                    activityCode: activityCode.AUCTION.GET_ACTIVITIES,
                    objectClass: objectClass.AUCTION
                }
            },
            {
                httpMethod: "post",
                path: "/auction/:id/register",
                method: "register",
                roles: [userRole.CUSTOMER],
                initialLog: {
                    activityCode: activityCode.AUCTION.REGISTER,
                    objectClass: objectClass.AUCTION
                }
            },
            {
                httpMethod: "get",
                path: "/auction/:id/bidders",
                method: "listBidders",
                roles: [userRole.AUCTIONEER],
                initialLog: {
                    activityCode: activityCode.AUCTION.GET_BIDDERS,
                    objectClass: objectClass.AUCTION
                }
            },
            {
                httpMethod: "put",
                path: "/auction/:id/verifyBidder/:bidderId",
                method: "verifyBidder",
                roles: [userRole.AUCTIONEER],
                initialLog: {
                    activityCode: activityCode.AUCTION.VERIFY_BIDDER,
                    objectClass: objectClass.AUCTION
                }
            },
            {
                httpMethod: "get",
                path: "/auction/:id/joinSession",
                method: "joinSession",
                roles: [userRole.AUCTIONEER, userRole.CUSTOMER],
                initialLog: {
                    activityCode: activityCode.AUCTION.JOIN_SESSION,
                    objectClass: objectClass.AUCTION
                }
            },
            {
                httpMethod: "get",
                path: "/auction/:id/participationStatus",
                method: "getParticipationStatus",
                roles: [userRole.CUSTOMER],
                initialLog: {
                    activityCode: activityCode.AUCTION.GET_PARTICIPATION_STATUS,
                    objectClass: objectClass.AUCTION
                }
            }
        ],
    },
];
