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
                path: "/asset/create",
                method: "createAsset",
                roles: [userRole.CUSTOMER],
                schema: assetValidation.createAsset,
            },
            {
                httpMethod: "post",
                path: "/asset/:id/pics",
                method: "uploadPics",
                roles: [userRole.CUSTOMER],
                files: "pics",
            },
            {
                httpMethod: "post",
                path: "/asset/:id/docs",
                method: "uploadDocs",
                roles: [userRole.CUSTOMER],
                files: "docs",
            },
            {
                httpMethod: "get",
                path: "/asset/:id",
                method: "viewAsset",
                roles: [userRole.CUSTOMER, userRole.ADMIN],
            },
            {
                httpMethod: "get",
                path: "/asset",
                method: "listAsset",
                roles: [userRole.CUSTOMER],
            },
        ],
    },
];
