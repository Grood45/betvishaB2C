const express = require("express");
const { GetTransactionsPl, GetAllGenerateChipOfOwneradmin, GetAllDepositOfSingle, GetAllWithdrawOfSingle, GetAllTransactionOfSingle, GetAllTransaction, GetAllDepositAmountForGraph, GetAllWithdrawAmountForGraph, GetAllTransactionAmountForGraph, UpdateDepositById, UpdateWithdrawById, GetAllTransactionAmountAndPl, GetAllTransactionAmountAndPlOfAdmin, CreateWithdrawTransaction, CreateDepositTransaction, GetTransactionsByUserId } = require("../controllers/transactioncontroller/transaction.controller");
const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const DepositModel = require("../models/deposit.model");
const WithdrawModel = require("../models/withdraw.model");
const { AddCommonQueryMiddleware } = require("../middlewares/mongoquery.middleware");

const TransactionRouter=express.Router()
TransactionRouter.get("/get-transaction-pl/:user_id", GetTransactionsPl);
TransactionRouter.get("/get-generate-chip-transaction", GetAllGenerateChipOfOwneradmin);
TransactionRouter.get("/get-all-deposit-single/:username", GetAllDepositOfSingle);
TransactionRouter.get("/get-all-withdraw-single/:username", GetAllWithdrawOfSingle);
TransactionRouter.get("/get-all-transaction-single/:username", GetAllTransactionOfSingle);
TransactionRouter.get("/get-all-transaction", GetAllTransaction);
TransactionRouter.post("/create-withdraw-request/:user_id", CreateWithdrawTransaction);
TransactionRouter.post("/create-deposit-request/:user_id", CreateDepositTransaction);
TransactionRouter.get("/get-all-deposit-amount-for-graph", GetAllDepositAmountForGraph);
TransactionRouter.get("/get-all-withdraw-amount-for-graph", GetAllWithdrawAmountForGraph);
TransactionRouter.get("/get-all-transaction-amount-for-graph", GetAllTransactionAmountForGraph);
TransactionRouter.patch("/update-single-deposit/:_id", UpdateDepositById);
TransactionRouter.patch("/update-single-withdraw/:_id", UpdateWithdrawById);
TransactionRouter.get("/get-admin-pl-details", GetAllTransactionAmountAndPl);
TransactionRouter.get("/get-admin-pl-details-self", GetAllTransactionAmountAndPlOfAdmin);
TransactionRouter.get("/get-all-transaction-by-user", GetTransactionsByUserId);


module.exports={TransactionRouter}
