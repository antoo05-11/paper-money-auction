import {ActivityLog} from "../models/activity_log";
import mongoose from "mongoose";
import {ceil, parseInt} from "lodash";

export const writeLogStatus = (activityLog, objectId, success) => {
    try {
        activityLog.success = success;
        activityLog.objectId = objectId;
        activityLog.save();
    } catch (error) {
        console.log("Controller message: Cannot save activity log status.")
    }
}

export default class ActivityLogController {
    constructor() {
    }

    getLog = async (req, res) => {
        const {query} = req;

        const pageSize = parseInt(query.limit || 10);
        const pageIndex = parseInt(query.page || 1);

        const dateFields = ['createdAt', 'success', 'activityCode'];

        // Filter
        const userFilter = query.user || '';
        const activityCodeFilter = query.activityCode || '';
        const createdAtFrom = query.createdAtFrom || new Date('2000-01-01');
        const createdAtTo = query.createdAtTo || new Date();
        const successFilter = query.success;

        const filterQuery = {
            createdAt: {
                $gte: new Date(createdAtFrom),
                $lte: new Date(createdAtTo)
            },
            activityCode: {
                $regex: activityCodeFilter
            }
        };
        if (successFilter) {
            filterQuery.success = {$eq: (successFilter === "true")}
        }

        const userMatchQuery = {};
        if (userFilter !== '') {
            userMatchQuery['$expr'] = {
                $gt: [{$size: "$users"}, 0]
            };
        }

        // Sort
        let sortObject = {'createdAt': -1};
        dateFields.forEach(field => {
            if (query[`${field}_sorted`]) {
                sortObject = {};
                sortObject[`${field}`] = query[`${field}_sorted`] === 'asc' ? 1 : -1;
            }
        });

        const activities = await ActivityLog.aggregate([
            {
                $match: filterQuery
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'subjectId',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    {name: {$regex: userFilter}},
                                    {email: {$regex: userFilter}},
                                    {ssid: {$regex: userFilter}},
                                    {phone: {$regex: userFilter}},
                                    {address: {$regex: userFilter}}
                                ]
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1
                            }
                        }
                    ],
                    as: 'users'
                }
            },
            {
                $addFields: {
                    subject: {
                        $arrayElemAt: ["$users", 0]
                    }
                }

            },
            {
                $match: userMatchQuery
            },
            {$sort: sortObject},
            {
                $group: {
                    _id: null,
                    count: {$sum: 1},
                    entries: {$push: "$$ROOT"}
                }
            }, {
                $addFields: {
                    activities: {
                        $slice: ['$entries', (pageIndex - 1) * pageSize, pageIndex * pageSize]
                    }
                }
            },
            {
                $project: {
                    count: 1,
                    activities: {
                        _id: 1,
                        subjectId: 1,
                        objectId: 1,
                        createdAt: 1,
                        objectClass: 1,
                        activityCode: 1,
                        success: 1,
                        subject: 1
                    }
                }
            }
        ]);

        let payload;
        if (activities.length === 0) {
            payload = {
                page: pageIndex,
                totalPages: 0,
                activities: []
            };
        } else {
            payload = {
                page: pageIndex,
                totalPages: ceil(activities[0].count / pageSize),
                activities: activities[0].activities
            };
        }
        return res.status(200).json(payload);
    }
}