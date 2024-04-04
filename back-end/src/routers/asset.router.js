import userRole from "../constants/user.role";
import AssetController from "../controllers/asset.controller";

export default [
    {
        controller: AssetController,
        methods: [
            {
                httpMethod: "post",
                path: "asset/create",
                method: "create",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "get",
                path: "asset/:id",
                method: "view",
                roles: [userRole.CUSTOMER],
            },
            {
                httpMethod: "get",
                path: "asset",
                method: "list",
                roles: [userRole.CUSTOMER],
            },
        ],
    },
];
