const express =require("express");
const { UpdateGameStatusById, GetAllGamesByProviderId, GetGamesByGameType, GetPopularGames, GetTopGames, GetAllGames, UpdateGameImageById, UpdatePriority, DeleteCategory, AddCategory } = require("../controllers/casinoprovidercontroller/games.controller");
const CheckPermission = require("../middlewares/checkpermission.middleware");

const GameRouter=express.Router()
GameRouter.patch("/update-game-status/:game_id/:provider_id", UpdateGameStatusById)
GameRouter.patch("/update-game-image/:game_id/:provider_id", UpdateGameImageById)
GameRouter.get("/get-game-by-provider/:provider_id", GetAllGamesByProviderId)
GameRouter.get("/get-game-by-game-type", GetGamesByGameType)
GameRouter.get("/get-popular-game", GetPopularGames)
GameRouter.get("/get-top-game", GetTopGames)
GameRouter.get("/get-all-game", GetAllGames)
GameRouter.patch("/update-priority", UpdatePriority)
GameRouter.patch("/delete-category/:id", DeleteCategory)
GameRouter.post("/add-category/:id", AddCategory)

// GameRouter.patch("/update-game-status/:game_id/:provider_id", CheckPermission("gameManage"), UpdateGameStatusById);
// GameRouter.patch("/update-game-image/:game_id/:provider_id", CheckPermission("gameManage"), UpdateGameImageById);
// GameRouter.get("/get-game-by-provider/:provider_id", GetAllGamesByProviderId);
// GameRouter.get("/get-game-by-game-type", GetGamesByGameType);
// GameRouter.get("/get-popular-game", GetPopularGames);
// GameRouter.get("/get-top-game", GetTopGames);
// GameRouter.get("/get-all-game", GetAllGames);
// GameRouter.patch("/update-priority", CheckPermission("gameManage"), UpdatePriority);
// GameRouter.patch("/delete-category/:id", CheckPermission("gameManage"), DeleteCategory);
// GameRouter.post("/add-category/:id", CheckPermission("gameManage"), AddCategory);

module.exports={GameRouter}