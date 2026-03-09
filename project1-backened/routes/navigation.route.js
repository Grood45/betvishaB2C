const express =require("express");
const { UpdateNavigationItem, GetAllNavigationData, DeleteNavigationItem } = require("../controllers/navigationcontroller/navigation.controller");
const CheckPermission = require("../middlewares/checkpermission.middleware");
const NavigationRouter=express.Router()
NavigationRouter.get("/get-all-navigation",GetAllNavigationData)
NavigationRouter.patch("/update-navigation/:id", UpdateNavigationItem)
NavigationRouter.delete("/delete-navigation/:id", DeleteNavigationItem)

// Apply middleware to NavigationRouter routes
// NavigationRouter.get("/get-all-navigation", GetAllNavigationData);
// NavigationRouter.patch("/update-navigation/:id", CheckPermission("gameNavigationManage"), UpdateNavigationItem);
// NavigationRouter.delete("/delete-navigation/:id", CheckPermission("gameNavigationManage"), DeleteNavigationItem);

module.exports={NavigationRouter}