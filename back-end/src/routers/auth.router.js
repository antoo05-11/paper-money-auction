import AuthController from "../controllers/auth.controller";
import authValidation from "../validations/auth.validation";

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
        ],
    },
];
