const express =require("express");
const { GetAllPromotions, DeletePromotion, UpdatePromotion, UpdatePromotionStatus, AddPromotion, GetAllPromotionsUser } = require("../controllers/promotioncontroller/promotion.controller");
const PromotionRouter=express.Router()
PromotionRouter.get("/get-all-promotion", GetAllPromotions);
PromotionRouter.get("/get-all-promotion-user", GetAllPromotionsUser);
PromotionRouter.delete("/delete-promotion/:promotion_id", DeletePromotion);
PromotionRouter.patch("/update-promotion/:promotion_id",UpdatePromotion );
PromotionRouter.get("/get-single-promotion/:promotion_id", GetAllPromotions);
PromotionRouter.patch("/update-promotion-status/:promotion_id", UpdatePromotionStatus);
PromotionRouter.post("/add-new-promotion", AddPromotion);
module.exports=PromotionRouter