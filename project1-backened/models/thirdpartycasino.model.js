// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    wagerId: { type: Number, unique: true, required: true },
    userCode: { type: String, required: true },
    txnType: { type: Number, required: true }, // 0 - Debit, 1 - Credit, 2 - Cancel
    amount: { type: Number, required: true },
    createdOn: { type: Date, default: Date.now },
    detail: { type: String, default: "" },
    vendorCode: { type: String, default: "" },
    txnCode: { type: String, default: "" },
    gameCode: { type: String, default: "" },
    gameRoundId: { type: String, default: "" }
});

const ThirdPartyTransactionModel=mongoose.model('ThirdPartyTransaction', transactionSchema);
module.exports = {ThirdPartyTransactionModel}