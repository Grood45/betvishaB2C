const User = require("../../models/user.model");
const mongoose = require("mongoose");
const { VerifyJwt } = require("../../utils/VerifyJwt");
const moment = require("moment");
const { GetCurrentAndBeforeTime } = require("../../utils/GetCurrentAndBeforeTime");

const GetUserGraphData = async (req, res) => {
    const { token, usernametoken } = req.headers;
    const modelQuery = req.query.modelQuery; // Contains site_auth_key and other filters

    try {
        if (!token || !usernametoken) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Invalid tokens. Access denied.",
            });
        }

        // Verify tokens (Authorization)
        const type = await VerifyJwt(token, req, res);
        const userUsername = await VerifyJwt(usernametoken, req, res);

        if (!userUsername || !type) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Invalid tokens, Access denied.",
            });
        }

        // Aggregation for Total User Distribution (Country/State)
        const locationDistribution = await User.aggregate([
            { $match: { ...modelQuery, role_type: "user" } }, // Filter by users and site_auth_key
            {
                $group: {
                    _id: {
                        country: { $toUpper: { $ifNull: [{ $cond: [{ $eq: ["$country", ""] }, "UNKNOWN", "$country"] }, "UNKNOWN"] } },
                        state: { $toUpper: { $ifNull: [{ $cond: [{ $eq: ["$state", ""] }, "UNKNOWN", "$state"] }, "UNKNOWN"] } }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Calculate time 5 minutes ago to cross-check active users
        const { fiveMinutesAgo } = GetCurrentAndBeforeTime();

        // Aggregation for Live User Distribution (Country/State where is_online: true OR recent activity)
        const liveUserDistribution = await User.aggregate([
            {
                $match: {
                    ...modelQuery,
                    role_type: "user",
                    $and: [
                        { is_online: true },
                        {
                            $or: [
                                { updated_at: { $gte: fiveMinutesAgo } },
                                { last_seen: { $gte: fiveMinutesAgo } }
                            ]
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        country: { $toUpper: { $ifNull: [{ $cond: [{ $eq: ["$country", ""] }, "UNKNOWN", "$country"] }, "UNKNOWN"] } },
                        state: { $toUpper: { $ifNull: [{ $cond: [{ $eq: ["$state", ""] }, "UNKNOWN", "$state"] }, "UNKNOWN"] } }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);


        // Total Counts
        const totalUsers = await User.countDocuments({ ...modelQuery, role_type: "user" });
        const totalLiveUsers = await User.countDocuments({
            ...modelQuery,
            role_type: "user",
            $and: [
                { is_online: true },
                {
                    $or: [
                        { updated_at: { $gte: fiveMinutesAgo } },
                        { last_seen: { $gte: fiveMinutesAgo } }
                    ]
                }
            ]
        });

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Graph data retrieved successfully.",
            data: {
                totalUsers,
                totalLiveUsers,
                locationDistribution,
                liveUserDistribution
            }
        });

    } catch (error) {
        console.error("Error fetching graph data:", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: error.message,
        });
    }
};

const GetUserJoinGraphData = async (req, res) => {
    const { token, usernametoken } = req.headers;
    const modelQuery = req.query.modelQuery; // For auth key and admin check
    const { startDate, endDate, adminName, joinType, groupBy = "month" } = req.query; // groupBy can be 'day', 'week', 'month', 'year'

    try {
        if (!token || !usernametoken) {
            return res.status(401).json({ status: 401, success: false, message: "Invalid tokens. Access denied." });
        }

        const type = await VerifyJwt(token, req, res);
        const userUsername = await VerifyJwt(usernametoken, req, res);

        if (!userUsername || !type) {
            return res.status(401).json({ status: 401, success: false, message: "Invalid tokens, Access denied." });
        }

        // Base match query
        const matchStage = {
            ...modelQuery,
            role_type: "user",
        };

        // Filter by Join Type (Manual vs Auto)
        if (joinType === "manual") {
            // Manual means created by admin
            matchStage.parent_admin_username = { $ne: "" };
        } else if (joinType === "auto") {
            // Auto means created themselves (blank admin)
            matchStage.parent_admin_username = "";
        }

        // Filter by Admin Name
        if (adminName) {
            matchStage.parent_admin_username = adminName;
        }

        // Filter by Date
        if (startDate && endDate) {
            matchStage.joined_at = {
                $gte: startDate,
                $lte: endDate
            };
        } else if (startDate) {
            matchStage.joined_at = { $gte: startDate };
        } else if (endDate) {
            matchStage.joined_at = { $lte: endDate };
        }

        let dateFormateString = "%Y-%m-%d"; // default day
        if (groupBy === "month") {
            dateFormateString = "%Y-%m";
        } else if (groupBy === "year") {
            dateFormateString = "%Y";
        }

        const aggregateQuery = [
            { $match: matchStage },
            {
                $addFields: {
                    parsedDate: {
                        $dateFromString: {
                            dateString: "$joined_at",
                            onError: null,
                            onNull: null
                        }
                    }
                }
            },
            {
                $match: { parsedDate: { $ne: null } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormateString, date: "$parsedDate" } },
                    count: { $sum: 1 },
                    autoCount: {
                        $sum: { $cond: [{ $eq: ["$parent_admin_username", ""] }, 1, 0] }
                    },
                    manualCount: {
                        $sum: { $cond: [{ $ne: ["$parent_admin_username", ""] }, 1, 0] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ];

        const graphData = await User.aggregate(aggregateQuery);

        return res.status(200).json({
            status: 200,
            success: true,
            message: "User join graph data retrieved successfully.",
            data: graphData
        });

    } catch (error) {
        console.error("Error fetching user join graph data:", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: error.message,
        });
    }
};

const GetUsersByJoinDate = async (req, res) => {
    const { token, usernametoken } = req.headers;
    const modelQuery = req.query.modelQuery || {};
    const { date, groupBy, joinType, adminName } = req.query;

    try {
        if (!token || !usernametoken) {
            return res.status(401).json({ status: 401, success: false, message: "Invalid tokens. Access denied." });
        }

        const type = await VerifyJwt(token, req, res);
        const userUsername = await VerifyJwt(usernametoken, req, res);

        if (!userUsername || !type) {
            return res.status(401).json({ status: 401, success: false, message: "Invalid tokens, Access denied." });
        }

        if (!date) {
            return res.status(400).json({ status: 400, success: false, message: "Date parameter is required." });
        }

        // Base match query
        const matchStage = {
            ...modelQuery,
            role_type: "user",
        };

        // Filter by Join Type (Manual vs Auto)
        if (joinType === "manual") {
            // Manual means created by admin
            matchStage.parent_admin_username = { $ne: "" };
        } else if (joinType === "auto") {
            // Auto means created themselves (blank admin)
            matchStage.parent_admin_username = "";
        }

        // Filter by Admin Name
        if (adminName) {
            matchStage.parent_admin_username = adminName;
        }

        // Regex pattern to match the beginning of the joined_at string depending on the group by
        let dateRegexPattern = `^${date}`;
        if (groupBy === "week") {
            // For weeks, it's more complex if it's not a standard string format. The graph is returning the exact format, so we can just use startsWith basically.
            // Usually, week aggregation format is %Y-%m-%d, so we just match the exact date if it's sent properly, or we can use $dateFromString in an aggregation pipeline to filter.
            // We'll use aggregation to properly match the parsed date string back to the clicked group.
        }

        let dateFormateString = "%Y-%m-%d"; // default day
        if (groupBy === "month") {
            dateFormateString = "%Y-%m";
        } else if (groupBy === "year") {
            dateFormateString = "%Y";
        }

        const aggregateQuery = [
            { $match: matchStage },
            {
                $addFields: {
                    parsedDate: {
                        $dateFromString: {
                            dateString: "$joined_at",
                            onError: null,
                            onNull: null
                        }
                    }
                }
            },
            {
                $match: { parsedDate: { $ne: null } }
            },
            {
                $addFields: {
                    formattedGroupDate: { $dateToString: { format: dateFormateString, date: "$parsedDate" } }
                }
            },
            {
                $match: { formattedGroupDate: date }
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    role_type: 1,
                    parent_admin_username: 1,
                    joined_at: 1,
                    is_online: 1,
                    status: 1,
                }
            },
            { $sort: { joined_at: -1 } }
        ];

        const users = await User.aggregate(aggregateQuery);

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Users retrieved successfully.",
            data: users
        });

    } catch (error) {
        console.error("Error fetching users by join date:", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: error.message,
        });
    }
};

const GetLiveUsersByLocation = async (req, res) => {
    const { token, usernametoken } = req.headers;
    const modelQuery = req.query.modelQuery || {};
    const { country, state } = req.query;

    try {
        if (!token || !usernametoken) {
            return res.status(401).json({ status: 401, success: false, message: "Invalid tokens. Access denied." });
        }

        const type = await VerifyJwt(token, req, res);
        const userUsername = await VerifyJwt(usernametoken, req, res);

        if (!userUsername || !type) {
            return res.status(401).json({ status: 401, success: false, message: "Invalid tokens, Access denied." });
        }

        const { fiveMinutesAgo } = GetCurrentAndBeforeTime();

        // Base match query (we only want users who are truly online recently)
        const matchStage = {
            ...modelQuery,
            role_type: "user",
            $and: [
                { is_online: true },
                {
                    $or: [
                        { updated_at: { $gte: fiveMinutesAgo } },
                        { last_seen: { $gte: fiveMinutesAgo } }
                    ]
                }
            ]
        };

        // If location filters are provided
        if (country && country.toUpperCase() !== "UNKNOWN" && country !== "undefined") {
            matchStage.country = new RegExp(`^${country}$`, "i");
        } else if (country && country.toUpperCase() === "UNKNOWN") {
            matchStage.country = { $in: [null, "", /^\s*$/] };
        }

        if (state && state.toUpperCase() !== "UNKNOWN" && state !== "undefined") {
            matchStage.state = new RegExp(`^${state}$`, "i");
        } else if (state && state.toUpperCase() === "UNKNOWN") {
            matchStage.state = { $in: [null, "", /^\s*$/] };
        }

        const aggregateQuery = [
            { $match: matchStage },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    role_type: 1,
                    parent_admin_username: 1,
                    joined_at: 1,
                    is_online: 1,
                    country: { $toUpper: { $ifNull: [{ $cond: [{ $eq: ["$country", ""] }, "UNKNOWN", "$country"] }, "UNKNOWN"] } },
                    state: { $toUpper: { $ifNull: [{ $cond: [{ $eq: ["$state", ""] }, "UNKNOWN", "$state"] }, "UNKNOWN"] } },
                    status: 1,
                }
            },
            { $sort: { joined_at: -1 } }
        ];

        const users = await User.aggregate(aggregateQuery);

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Live users retrieved successfully.",
            data: users
        });

    } catch (error) {
        console.error("Error fetching live users by location:", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: error.message,
        });
    }
};

module.exports = { GetUserGraphData, GetUserJoinGraphData, GetUsersByJoinDate, GetLiveUsersByLocation };
