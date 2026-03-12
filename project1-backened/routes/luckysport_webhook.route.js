const express = require('express');
const router = express.Router();
const luckysportWebhook = require('../controllers/sportcontroller.js/luckysport_webhook.controller');
const { verifyLuckySportJWT } = require('../middlewares/luckysport/jwt.middleware');
const { verifyLuckySportIP } = require('../middlewares/luckysport/ip.middleware');
const { validateLuckySportPayload } = require('../middlewares/luckysport/validator.middleware');

/**
 * LuckySport Seamless Wallet Webhooks
 * Protected by Multi-layer Security: IP Whitelisting + JWT Verification + Payload Validation
 */
router.get('/balance', verifyLuckySportIP, verifyLuckySportJWT, validateLuckySportPayload('balance'), luckysportWebhook.handleBalance);
router.post('/bet/make', verifyLuckySportIP, verifyLuckySportJWT, validateLuckySportPayload('bet'), luckysportWebhook.handleBet);
router.post('/bet/win', verifyLuckySportIP, verifyLuckySportJWT, validateLuckySportPayload('win'), luckysportWebhook.handleWin);
router.post('/bet/rollback', verifyLuckySportIP, verifyLuckySportJWT, validateLuckySportPayload('rollback'), luckysportWebhook.handleRollback);

module.exports = router;
