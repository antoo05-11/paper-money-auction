export const writeLogStatus = (activityLog, objectId, success) => {
    try {
        activityLog.success = success;
        activityLog.objectId = objectId;
        activityLog.save();
    } catch (error) {
        console.log("Controller message: Cannot save activity log status.")
    }
}