import userRole from "../constants/user.role";
import AssetController from "../controllers/asset.controller";
import assetValidation from "../validations/asset.validation";
import activityCode from "../constants/activity.code";

export default [
    {
        controller: AssetController,
        methods: [
            {
                httpMethod: "post",
                path: "/asset",
                method: "createAsset",
                roles: [userRole.CUSTOMER],
                verified: true,
                schema: assetValidation.createAsset,
                files: [
                    {name: "pics", maxCount: 3},
                    {name: "docs", maxCount: 3},
                ],
                initialLog: {
                    activityCode: activityCode.ASSET.CREATE
                }
            },
            {
                httpMethod: "get",
                path: "/asset/:id",
                method: "viewAsset",
                roles: [userRole.CUSTOMER, userRole.ADMIN, userRole.AUCTIONEER],
                verified: true,
                initialLog: {
                    activityCode: activityCode.ASSET.GET_BY_ID
                }
            },
            {
                httpMethod: "get",
                path: "/asset",
                method: "listAsset",
                roles: [userRole.CUSTOMER, userRole.AUCTIONEER, userRole.ADMIN],
                verified: true,
                initialLog: {
                    activityCode: activityCode.ASSET.GET_LIST
                }
            },
            {
                httpMethod: "put",
                path: "/asset/:id",
                method: "verifyAsset",
                roles: [userRole.ADMIN],
                schema: assetValidation.verifyAsset,
                initialLog: {
                    activityCode: activityCode.ASSET.VERIFY
                }
            },
        ],
    },
];
