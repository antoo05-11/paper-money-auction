import {ActivityLog} from "../models/activity_log";
import activityCode from "../constants/activity.code";
import userRole from "../constants/user.role";

// If the activity need to save subject info, perform auth to save user before performing this.
// Argument `activityLog` needs to oblige ActivityLog model.
// After performing this, `req` will be added with `activityLog` field.
export const writeActivityLog = (activityLog) => async (req, res, next) => {
    try {
        if (req.user) activityLog.subjectId = req.user._id;
        if (req.user.role === userRole.ADMIN) {
            next();
            return;
        }
        activityLog = await ActivityLog.create(activityLog);
        if (activityCode) {
            req.activityLog = activityLog;
        }
    } catch (e) {
        console.log("Middleware message: Cannot create activity log", e);
    }
    next();
};
