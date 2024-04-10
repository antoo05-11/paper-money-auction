import UserController from "../controllers/user.controller";
import userRole from "../constants/user.role";
import userValidation from "../validations/user.validation";

export default [
    {
        controller: UserController,
        methods: [
            {
                httpMethod: "post",
                path: "/user/create/customer",
                method: "createCustomer",
                schema: userValidation.createCustomer,
            },
            {
                httpMethod: "post",
                path: "/user/create/staff",
                method: "createStaff",
                roles: [userRole.ADMIN],
                schema: userValidation.createStaff,
            },
            {
                httpMethod: "get",
                path: "/user/profile",
                method: "viewProfile",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER],
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
                path: "/user/payment",
                method: "updatePaymentMethod",
                roles: [userRole.CUSTOMER],
                schema: userValidation.updatePayment,
            },
            {
                httpMethod: "get",
                path: "/user/payment",
                method: "viewPaymentMethod",
                roles: [userRole.CUSTOMER],
            },
        ],
    },
];
