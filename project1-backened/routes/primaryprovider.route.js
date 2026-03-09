const express = require("express");

const {GetProviderInformation, UpdateProviderInformationStatus, UpdateProviderInformation, AddProviderInformation, GetAuthorizedProviderInformation } = require("../controllers/casinocontroller/providerscontroller/primaryprovider.controller");

const ProviderInformationRoute = express.Router();
ProviderInformationRoute.get("/get-provider-information",GetProviderInformation);
ProviderInformationRoute.get("/get-authorized-provider-information",GetAuthorizedProviderInformation);
ProviderInformationRoute.post("/add-provider-information", AddProviderInformation);
ProviderInformationRoute.patch("/update-provider-information-status/:id", UpdateProviderInformationStatus);
ProviderInformationRoute.patch("/update-provider-information/:id", UpdateProviderInformation);

module.exports={ProviderInformationRoute}