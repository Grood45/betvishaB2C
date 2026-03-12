/**
 * LuckySport Payload Validator
 * Ensures all incoming webhook requests have the required structure.
 * Prevents "Undefined" errors and malformed data from reaching the service layer.
 */
const validateLuckySportPayload = (type) => {
    return (req, res, next) => {
        const payload = req.luckysport_payload; // From JWT middleware

        if (!payload) {
            return res.status(400).json({ status: 1000, message: "Missing payload data." });
        }

        const requiredFields = {
            'balance': ['user_id'],
            'bet': ['user_id', 'amount', 'transaction_id'],
            'win': ['user_id', 'amount', 'transaction_id'],
            'rollback': ['user_id', 'amount', 'transaction_id', 'original_transaction_id']
        };

        const fields = requiredFields[type];
        const missing = fields.filter(field => payload[field] === undefined || payload[field] === null);

        if (missing.length > 0) {
            console.error(`[LuckySport Validator] Missing fields for ${type}: ${missing.join(', ')}`);
            return res.status(200).json({
                status: 1000,
                message: `Protocol Error: Missing ${missing.join(', ')}`
            });
        }

        // Additional validation: Amount must be a positive integer
        if (['bet', 'win', 'rollback'].includes(type)) {
            if (typeof payload.amount !== 'number' || payload.amount < 0) {
                return res.status(200).json({ status: 1000, message: "Invalid amount format." });
            }
        }

        next();
    };
};

module.exports = { validateLuckySportPayload };
