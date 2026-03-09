const express = require('express');
const { GetKeyDepositAndLogin, WithdrawAndLogout, GetSportBalance, GetLastOneDayBetHistory, GetSportBalanceAdmin, GetAllSportBetHistoryUser, GetAllSportBetHistoryUserByAdmin } = require('../controllers/sportcontroller.js/sport.controller');
const { getSportSetup, upsertSportSetup, getActiveSportProviders } = require('../controllers/sportcontroller.js/sportsetup.controller');
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

module.exports = SportRouter;