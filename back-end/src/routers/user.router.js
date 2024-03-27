import UserController from "../controllers/user.controller";
import userRole from "../constants/user.role";

export default [
    {
        controller: UserController,
        methods: [
            {
                httpMethod: "post",
                path: "user/create",
                method: "create_user",
            },
            {
                httpMethod: "get",
                path: "user/profile",
                method: "view_profile",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER],
            },
            {
                httpMethod: "put",
                path: "user/profile",
                method: "update_profile",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "put",
                path: "user/password",
                method: "update_password",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER],
            },
            {
                httpMethod: "put",
                path: "user/payment",
                method: "update_payment_method",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "get",
                path: "user/payment",
                method: "view_payment_method",
                roles: [userRole.CUSTOMER],
            },
        ],
    },
];
