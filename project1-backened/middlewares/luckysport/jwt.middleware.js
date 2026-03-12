const jwt = require('jsonwebtoken');
const { SportSetupModel } = require('../../models/providers/sportsetup.model');

/**
 * LuckySport JWT Verification Middleware
 * Following 20-year developer standards: Secure, dynamic, and informative error handling.
 */
const verifyLuckySportJWT = async (req, res, next) => {
    try {
        // 1. Fetch the JWT Secret from the DB (Managed via Admin UI)
        const setup = await SportSetupModel.findOne({ provider_name: 'LuckySport' });

        if (!setup || !setup.jwt_secret) {
            console.error("[LuckySport Security] Webhook JWT Secret not configured.");
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Security configuration missing on merchant side."
            });
        }

        // 2. Extract Token from Header (Usually Bearer or specific header as per provider)
        // LuckySport usually sends it in 'Authorization' or 'X-Lucky-Signature'
        const authHeader = req.headers['authorization'] || req.headers['x-lucky-signature'];

        if (!authHeader) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Authentication signature missing."
            });
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

        // 3. Verify the JWT
        try {
            const decoded = jwt.verify(token, setup.jwt_secret);
            req.luckysport_payload = decoded; // Attach for controller use
            next();
        } catch (err) {
            console.error("[LuckySport Security] JWT Verification Failed:", err.message);
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Invalid signature or expired token."
            });
        }

    } catch (error) {
        console.error("[LuckySport Security Critical Error]:", error.message);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal security verification error."
        });
    }
};

module.exports = { verifyLuckySportJWT };
