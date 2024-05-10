import userRole from "../constants/user.role";
import ActivityLogController from "../controllers/activity_log.controller";

export default [
    {
        controller: ActivityLogController,
        methods: [
            {
                httpMethod: "get",
                path: "/log",
                method: "getLog",
                roles: []
            }
        ]
    }
];
