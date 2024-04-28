import UserController from "../controllers/user.controller";
import userRole from "../constants/user.role";
import userValidation from "../validations/user.validation";

export default [
    {
        controller: UserController,
        methods: [
            {
                httpMethod: "post",
                path: "/user/customer",
                method: "createCustomer",
                schema: userValidation.createCustomer,
            },
            {
                httpMethod: "post",
                path: "/user/auctioneer",
                method: "createAuctioneer",
                roles: [userRole.ADMIN],
                schema: userValidation.createAuctioneer,
            },
            {
                httpMethod: "get",
                path: "/user/profile",
                method: "viewProfile",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER],
            },
            {
                httpMethod: "get",
                path: "/user/profile/:id",
                method: "viewCustomerProfile",
                roles: [userRole.ADMIN, userRole.AUCTIONEER],
            },
            {
                httpMethod: "put",
                path: "/user/profile",
                method: "updateProfile",
                roles: [userRole.CUSTOMER],
                schema: userValidation.updateProfile,
            },
            {
                httpMethod: "put",
                path: "/user/password",
                method: "updatePassword",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER],
                schema: userValidation.updatePassword,
            },
            {
                httpMethod: "put",
                path: "/user/payment-method",
                method: "updatePaymentMethod",
                roles: [userRole.CUSTOMER],
                schema: userValidation.updatePayment,
            },
            {
                httpMethod: "get",
                path: "/user/payment-method",
                method: "viewPaymentMethod",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "get",
                path: "/user/staff",
                method: "getAllStaff",
                roles: [userRole.ADMIN],
            },
            {
                httpMethod: "get",
                path: "/user/customer",
                method: "getAllCustomer",
                roles: [userRole.ADMIN],
            },
        ],
    },
];
