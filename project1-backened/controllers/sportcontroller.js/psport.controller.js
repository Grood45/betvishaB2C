const axios = require('axios');
const User = require('../../models/user.model');

// Helper function to send POST requests to Powerplay API
const sendApiRequest = async (url, method, data) => {
    try {
        const response = await axios({
            method,
            url,
            headers: {
                'x-app': process.env.X_APP_KEY,  // Get the API key from environment variable
            },
            data: data,
        });
        return response.data;
    } catch (error) {
        return { status: 'error', message: error.response ? error.response.data : error.message };
    }
};

// Get balance
const getBalance = async (req, res) => {
    const { PartnerId, Username } = req.body;

    try {
        const user = await User.findOne({ username: Username });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        return res.json({ status: 'success', balance: user.balance });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// Place bet
const placeBet = async (req, res) => {
    const { PartnerId, Username, Eventtypename, Competitionname, Eventname, Marketname, Markettype, TransactionType, MarketID, TotalAmount, Point, cashout } = req.body;
    try {
        const user = await User.findOne({ username: Username });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        if (user.balance < TotalAmount) {
            return res.status(400).json({ status: 'error', message: 'Insufficient balance' });
        }

        // Deduct the bet amount
        user.balance -= TotalAmount;
        await user.save();

        // Save the bet to the Bet collection
        const newBet = new Bet({
            username: Username,
            marketId: MarketID,
            amount: TotalAmount,
            status: 'placed',
            transactionId: `${Date.now()}-${Math.floor(Math.random() * 1000)}`
        });
        await newBet.save();

        // Send the request to Powerplay API to place the bet
        const requestBody = {
            PartnerId,
            Username,
            Eventtypename,
            Competitionname,
            Eventname,
            Marketname,
            Markettype,
            TransactionType,
            MarketID,
            TotalAmount,
            Point,
            cashout
        };

        if (!process.env.PARTNER_API_URL || process.env.PARTNER_API_URL === "") {
            return res.status(200).json({ status: 'error', message: 'Sport provider API not configured. Please contact admin.' });
        }

        const response = await sendApiRequest(`${process.env.PARTNER_API_URL}/placebet`, 'POST', requestBody);

        return res.json(response);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// Cancel placed bet
const cancelPlaceBet = async (req, res) => {
    const { PartnerId, Username, TransactionID, Markettype, MarketID, TransactionType, Amount } = req.body;

    try {
        const bet = await Spor.findOne({ transactionId: TransactionID });

        if (!bet) {
            return res.status(404).json({ status: 'error', message: 'Bet not found' });
        }

        const user = await User.findOne({ username: Username });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Refund the bet amount
        user.balance += bet.amount;
        await user.save();

        // Update bet status to 'cancelled'
        bet.status = 'cancelled';
        await bet.save();

        // Send the request to Powerplay API to cancel the bet
        const requestBody = {
            PartnerId,
            Username,
            TransactionID,
            Markettype,
            MarketID,
            TransactionType,
            Amount
        };

        const response = await sendApiRequest(`${process.env.PARTNER_API_URL}/cancelPlaceBet`, 'POST', requestBody);

        return res.json(response);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// Cancel market
const marketCancel = async (req, res) => {
    const { PartnerId, Username, MarketID } = req.body;

    try {
        const market = await Market.findOne({ marketId: MarketID });

        if (!market) {
            return res.status(404).json({ status: 'error', message: 'Market not found' });
        }

        market.status = 'cancelled';
        await market.save();

        const requestBody = { PartnerId, Username, MarketID };
        const response = await sendApiRequest(`${process.env.PARTNER_API_URL}/MarketCancel`, 'POST', requestBody);

        return res.json(response);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// Settle market
const settleMarket = async (req, res) => {
    const { PartnerId, MarketID, Status, Result } = req.body;

    try {
        // Send the request to Powerplay API to settle the market
        const requestBody = { PartnerId, MarketID, Status, Result };
        const response = await sendApiRequest(`${process.env.PARTNER_API_URL}/settleMarket`, 'POST', requestBody);

        // Optionally, you can update your MongoDB market status here.
        const market = await Market.findOne({ marketId: MarketID });
        if (market) {
            market.status = 'settled';
            await market.save();
        }

        return res.json(response);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// Cancel settled market
const cancelSettledMarket = async (req, res) => {
    const { PartnerId, MarketID, TransactionID } = req.body;

    try {
        // Send the request to Powerplay API to cancel the settled market
        const requestBody = { PartnerId, MarketID, TransactionID };
        const response = await sendApiRequest(`${process.env.PARTNER_API_URL}/CancelSettledMarket`, 'POST', requestBody);

        // Optionally, you can update your MongoDB market status here.
        const market = await Market.findOne({ marketId: MarketID });
        if (market) {
            market.status = 'cancelled';
            await market.save();
        }

        return res.json(response);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// Resettle market
const resettleMarket = async (req, res) => {
    const { PartnerId, MarketID, Status, Result } = req.body;

    try {
        // Send the request to Powerplay API to resettle the market
        const requestBody = { PartnerId, MarketID, Status, Result };
        const response = await sendApiRequest(`${process.env.PARTNER_API_URL}/resettleMarket`, 'POST', requestBody);

        // Optionally, you can update your MongoDB market status here.
        const market = await Market.findOne({ marketId: MarketID });
        if (market) {
            market.status = 'resettled';
            await market.save();
        }

        return res.json(response);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// Export all controllers
module.exports = {
    getBalance,
    placeBet,
    cancelPlaceBet,
    marketCancel,
    settleMarket,
    cancelSettledMarket,
    resettleMarket
};
