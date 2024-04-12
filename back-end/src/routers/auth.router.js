import AuthController from "../controllers/auth.controller";
import authValidation from "../validations/auth.validation";
import userRole from "../constants/user.role";

export default [
    {
        controller: AuthController,
        methods: [
            {
                httpMethod: "post",
                path: "/auth/login",
                method: "login",
                schema: authValidation.login,
            },
            {
                httpMethod: "post",
                path: "/auth/login/authenticate",
                method: "authenticateLogin",
                schema: authValidation.authenticate,
            },
            {
                httpMethod: "get",
                path: "/auth/verify",
                method: "sendCode",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER],
            },
            {
                httpMethod: "post",
                path: "/auth/verify",
                method: "verifyCode",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER],
                schema: authValidation.verify,
            },
        ],
    },
];
