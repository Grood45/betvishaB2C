const express = require('express');
const { GetSingleAffiliate, UpdateSingleAffiliate, AffiliateLogin, GetAffiliateDashboardData, ChangeAffiliatePassword } = require('../controllers/affiliatecontroller/affiliate.controller');
const AffiliateRouter = express.Router();

AffiliateRouter.get('/get-single-affiliate', GetSingleAffiliate);
AffiliateRouter.put('/update-single-affiliate/:id', UpdateSingleAffiliate);
AffiliateRouter.post('/affiliate-login', AffiliateLogin);
AffiliateRouter.get('/get-affiliate-dashboard-data', GetAffiliateDashboardData);
AffiliateRouter.post('/change-affiliate-password', ChangeAffiliatePassword);

module.exports = {AffiliateRouter}
