import {ActivityLog} from "../models/activity_log";
import activityCode from "../constants/activity.code";

// If the activity need to save subject info, perform auth to save user before performing this.
// Argument `activityLog` needs to oblige ActivityLog model.
export const writeActivityLog = (activityLog) => async (req, res, next) => {
    try {
        if (req.user) activityLog.subjectId = req.user._id;
        activityLog = await ActivityLog.create(activityLog);
        if (activityCode) {
            req.activityLog = activityLog;
        }
    } catch (e) {
        console.log("Middleware message: Cannot create activity log", e);
    }
    next();
};
