const express = require('express');
const { resettleMarket, getBalance, cancelPlaceBet, placeBet, marketCancel, settleMarket, cancelSettledMarket } = require('../controllers/sportcontroller.js/psport.controller');
const SportCallbackRouter = express.Router();

// Route to get balance
SportCallbackRouter.post('/GetBalance', getBalance);

// Route to place bet
SportCallbackRouter.post('/PlaceBet', placeBet);

// Route to cancel placed bet
SportCallbackRouter.post('/CancelPlaceBet', cancelPlaceBet);

// Route to cancel market
SportCallbackRouter.post('/MarketCancel', marketCancel);

// Route to settle market
SportCallbackRouter.post('/SettleMarket', settleMarket);

// Route to cancel settled market
SportCallbackRouter.post('/CancelSettledMarket', cancelSettledMarket);

// Route to resettle market
SportCallbackRouter.post('/ResettleMarket', resettleMarket);

module.exports = { SportCallbackRouter };
