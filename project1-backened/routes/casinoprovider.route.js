const express = require("express");
const { GetProvider, ToggleProvider, UpdateProviderPriority, UpdateProviderImage, UpdateProviderCategoryImage, AddCategory, DeleteCategory } = require("../controllers/casinoprovidercontroller/casinoprovider.controller");
const CheckPermission = require("../middlewares/checkpermission.middleware");
const CasinoProviderRouter = express.Router();

CasinoProviderRouter.get("/get-provider",GetProvider);
CasinoProviderRouter.patch("/toggle-provider/:id", CheckPermission("providerManage"), ToggleProvider);
CasinoProviderRouter.patch("/update-priority",CheckPermission("providerManage"), UpdateProviderPriority);
CasinoProviderRouter.patch("/update-provider-image",CheckPermission("providerManage"), UpdateProviderImage);
CasinoProviderRouter.patch("/update-provider-category-image",CheckPermission("providerManage"), UpdateProviderCategoryImage);
CasinoProviderRouter.patch("/delete-category/:id", CheckPermission("providerManage"), DeleteCategory);
CasinoProviderRouter.post("/add-category/:id", CheckPermission("providerManage"), AddCategory);

// Applying middleware to CasinoProviderRouter routes
// CasinoProviderRouter.get("/get-provider", CheckPermission("providerView"), GetProvider);
// CasinoProviderRouter.patch("/toggle-provider/:id", CheckPermission("providerManage"), ToggleProvider);
// CasinoProviderRouter.patch("/update-priority", CheckPermission("providerManage"), UpdateProviderPriority);
module.exports={CasinoProviderRouter}