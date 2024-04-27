import userRole from "../constants/user.role";
import AssetController from "../controllers/asset.controller";
import assetValidation from "../validations/asset.validation";

export default [
    {
        controller: AssetController,
        methods: [
            // Create Asset
            {
                httpMethod: "post",
                path: "/asset",
                method: "createAsset",
                roles: [userRole.CUSTOMER],
                verified: true,
                schema: assetValidation.createAsset,
                files: [
                    { name: "pics", maxCount: 3 },
                    { name: "docs", maxCount: 3 },
                ],
            },
            {
                httpMethod: "get",
                path: "/asset/:id",
                method: "viewAsset",
                roles: [userRole.CUSTOMER, userRole.ADMIN, userRole.AUCTIONEER],
            },
            {
                httpMethod: "get",
                path: "/asset",
                method: "listAsset",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER, userRole.ADMIN],
            },
            {
                httpMethod: "put",
                path: "/asset/:id",
                method: "verifyAsset",
                roles: [userRole.ADMIN],
                schema: assetValidation.verifyAsset,
            },
        ],
    },
];
