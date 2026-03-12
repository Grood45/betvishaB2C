const express = require('express');
const { GetKeyDepositAndLogin, WithdrawAndLogout, GetSportBalance, GetLastOneDayBetHistory, GetSportBalanceAdmin, GetAllSportBetHistoryUser, GetAllSportBetHistoryUserByAdmin } = require('../controllers/sportcontroller.js/sport.controller');
const { getSportSetup, upsertSportSetup, getActiveSportProviders } = require('../controllers/sportcontroller.js/sportsetup.controller');
const { GetLuckySportToken, GetLuckySportBetHistory, GetLuckySportBetHistoryUser, GetLuckySportSessionToken, GetLuckySportMerchantQuota } = require('../controllers/sportcontroller.js/luckysport.controller');
const { GetUserBalanceWebhook, WithdrawWebhook, DepositWebhook } = require('../controllers/sportcontroller.js/luckysportwebhook.controller');
const { queryDomainMiddleware } = require('../middlewares/applysportdomain.middleware');
const SportRouter = express.Router();

SportRouter.post('/get-key-and-login', queryDomainMiddleware, GetKeyDepositAndLogin);
SportRouter.post('/withdraw-and-logout', queryDomainMiddleware, WithdrawAndLogout);
SportRouter.get('/get-sport-balance', queryDomainMiddleware, GetSportBalance);
// for user 
SportRouter.post('/get-all-sport-bet-history', queryDomainMiddleware, GetAllSportBetHistoryUser);
// for admin 
SportRouter.post('/get-last-one-day-bet-history', queryDomainMiddleware, GetLastOneDayBetHistory);
SportRouter.post('/get-all-sport-bet-history-user-by-admin', queryDomainMiddleware, GetAllSportBetHistoryUserByAdmin);
SportRouter.get('/get-sport-balance-admin', queryDomainMiddleware, GetSportBalanceAdmin);

// Provider Setup Routes
SportRouter.get('/active-providers', getActiveSportProviders);
SportRouter.get('/setup/:provider_name', getSportSetup);
SportRouter.post('/setup', upsertSportSetup);

// LuckySport Endpoints
SportRouter.post('/get-lucky-sport-token', GetLuckySportToken);
SportRouter.post('/get-lucky-sport-session', GetLuckySportSessionToken);
SportRouter.post('/lucky-sport/user-balance', GetUserBalanceWebhook);
SportRouter.post('/lucky-sport/withdraw', WithdrawWebhook);
SportRouter.post('/lucky-sport/deposit', DepositWebhook);

// LuckySport History
SportRouter.post('/get-lucky-sport-bet-history', GetLuckySportBetHistory);
SportRouter.post('/get-lucky-sport-bet-history-user', GetLuckySportBetHistoryUser);
SportRouter.get('/lucky-sport/merchant-quota', GetLuckySportMerchantQuota);

module.exports = SportRouter;