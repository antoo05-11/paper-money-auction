import AuctionSessionController from "../controllers/auction_session.controller";
import UserRole from "../constants/user.role";

export default [
    {
        controller: AuctionSessionController,
        methods: [
            {
                httpMethod: "post",
                path: "/auction_session/:id/enter",
                method: "enterAuctionRoom",
                roles: [
                    UserRole.USER
                ]
            },
        ],
    },
];
