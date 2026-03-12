/**
 * LuckySport IP Whitelisting Middleware
 * Restricts access to LuckySport webhook endpoints to only authorized provider IPs.
 * Industrial Standard: Multi-layer security (JWT + IP).
 */
const verifyLuckySportIP = (req, res, next) => {
    // Authorized LuckySport IPs (Staging/Production - Based on technical documentation)
    // Note: User can update these in .env later if they change
    const allowedIPs = [
        '54.235.147.64', // Example Staging IP
        '::ffff:54.235.147.64', // IPv6 mapped IPv4
        '127.0.0.1', // For local testing
        '::1'
    ];

    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Check if clientIP is in allowed list
    const isAllowed = allowedIPs.some(ip => clientIP.includes(ip));

    if (!isAllowed) {
        console.warn(`[LuckySport Security] Blocked unauthorized IP access attempt: ${clientIP}`);
        // Senior Tip: Don't give too much info to hackers. Just 403.
        return res.status(403).json({
            status: 403,
            success: false,
            message: "Access denied from this network."
        });
    }

    next();
};

module.exports = { verifyLuckySportIP };
