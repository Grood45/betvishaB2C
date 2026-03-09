const express =require("express");
const { GetALLGameNavigationData, UpdateGameNavigationItem, AddGameNavigation,DeleteGameNavigation } = require("../controllers/gamecategorycontroller/gamenavigation.controller");
const CheckPermission = require("../middlewares/checkpermission.middleware");

const GameNavigationRouter=express.Router()
GameNavigationRouter.get("/get-all-game-navigation",GetALLGameNavigationData)
GameNavigationRouter.patch("/update-game-navigation/:id", UpdateGameNavigationItem)
GameNavigationRouter.post("/add-game-navigation", AddGameNavigation)
GameNavigationRouter.delete("/delete-game-navigation/:id", DeleteGameNavigation)

// Apply middleware to GameNavigationRouter routes
// GameNavigationRouter.get("/get-all-game-navigation", GetALLGameNavigationData);
// GameNavigationRouter.patch("/update-game-navigation/:id", CheckPermission("gameNavigationManage"), UpdateGameNavigationItem);
// GameNavigationRouter.post("/add-game-navigation", CheckPermission("gameNavigationManage"), AddGameNavigation);
// GameNavigationRouter.delete("/delete-game-navigation/:id", CheckPermission("gameNavigationManage"), DeleteGameNavigation);


module.exports={GameNavigationRouter}