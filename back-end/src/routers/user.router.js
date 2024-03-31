import UserController from "../controllers/user.controller";
import userRole from "../constants/user.role";

export default [
    {
        controller: UserController,
        methods: [
            {
                httpMethod: "post",
                path: "/customer/create",
                method: "create_customer",
            },
            {
                httpMethod: "get",
                path: "/user/:id/profile",
                method: "view_profile",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER],
            },
            {
                httpMethod: "put",
                path: "/user/:id/profile",
                method: "update_profile",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "put",
                path: "/user/:id/password",
                method: "update_password",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER],
            },
            {
                httpMethod: "put",
                path: "/user/:id/payment",
                method: "update_payment_method",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "get",
                path: "/user/:id/payment",
                method: "view_payment_method",
                roles: [userRole.CUSTOMER],
            },
        ],
    },
];
