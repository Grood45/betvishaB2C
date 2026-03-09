const Promotion = require("../../models/promotion.model");
const { VerifyJwt } = require("../../utils/VerifyJwt");
async function UpdatePromotion(req, res) {
  const modelQuery = req.query.modelQuery;
  const { token, usernametoken } = req.headers;
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }

  try {
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    const query = {
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
    };
    const promotion_id = req.params.promotion_id;
    const updates = req.body;
    const promotionData = await Promotion.findOne({
      _id: promotion_id,
      ...modelQuery,
    });
    const promotionExitsOrNot = await Promotion.findOne({
      category: updates.category,
      sub_category: updates.sub_category,
      ...modelQuery,
    });

    if (
      updates.category !== promotionData.category ||
      updates.sub_category !== promotionData.sub_category
    ) {
      if (promotionExitsOrNot) {
        return res.status(400).json({
          status: 400,
          success: true,
          message:
            "Promotion Already Exit with Same Category and Sub Category ",
          promotion: null,
        });
      }
    }

    const updatedPromotion = await Promotion.findOneAndUpdate(
      { _id: promotion_id, ...query },
      updates,
      { new: true }
    );
    if (!updatedPromotion) {
      return res
        .status(404)
        .json({ status: 404, success: false, message: "Promotion not found" });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      updatedPromotion,
      message: "Promotion update successfully.",
    });
  } catch (error) {
    console.error("Error updating promotion:", error);
    return res
      .status(500)
      .json({ status: 500, success: false, error: "Internal server error" });
  }
}

async function DeletePromotion(req, res) {
  const { token, usernametoken } = req.headers;
  const modelQuery = req.query.modelQuery;
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }

  try {
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    const query = {
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      ...modelQuery,
    };

    const promotion_id = req.params.promotion_id;
    const deletedPromotion = await Promotion.findOneAndDelete({
      _id: promotion_id,
      ...query,
    });

    if (!deletedPromotion) {
      return res
        .status(404)
        .json({ status: 404, success: false, error: "Promotion not found" });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return res
      .status(500)
      .json({ status: 500, success: false, error: "Internal server error" });
  }
}

async function UpdatePromotionStatus(req, res) {
  const modelQuery = req.query.modelQuery;
  const { token, usernametoken } = req.headers;
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }
  try {
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    const query = {
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      ...modelQuery,
    };

    const promotion_id = req.params.promotion_id;
    const { status } = req.body;
    const updatedPromotion = await Promotion.findOneAndUpdate(
      { _id: promotion_id, ...query },
      { status },
      { new: true }
    );

    if (!updatedPromotion) {
      return res
        .status(404)
        .json({ status: 404, success: false, error: "Promotion not found" });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      updatedPromotion,
      message: "Promotion toggled successfully.",
    });
  } catch (error) {
    console.error("Error changing promotion status:", error);
    return res
      .status(500)
      .json({ status: 500, success: false, error: "Internal server error" });
  }
}

async function GetAllPromotions(req, res) {
  const { token, usernametoken } = req.headers;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const {modelQuery, category, sub_category} = req.query;
  
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }

  try {
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    const query = {
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      ...modelQuery,
    };
    if(category){
      query.category = category;
    }
    if(sub_category){
      query.sub_category = sub_category;
    }
    const promotions = await Promotion.find(query)
      .limit(limit)
      .skip((page - 1) * limit);

    return res.status(200).json({
      status: 200,
      success: true,
      promotions,
    });
  } catch (error) {
    console.error("Error retrieving promotions:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
}

async function GetAllPromotionsUser(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const {modelQuery, category, sub_category} = req.query;
  let query = {...modelQuery, status:true}
  if(category) {
    query.category = category;
  }
  if(sub_category) {
    query.sub_category = sub_category;
  }
  try {
    const promotions = await Promotion.find(query)
      .limit(limit)
      .skip((page - 1) * limit);
    return res.status(200).json({
      status: 200,
      success: true,
      promotions,
    });
  } catch (error) {
    console.error("Error retrieving promotions:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
}

async function GetSinglePromotion(req, res) {
  const { token, usernametoken } = req.headers;
  const {modelQuery, category, sub_category} = req.query;
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }

  try {
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    const query = {
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      ...modelQuery,
    };

    if(category) {
      query.category = category;
    }
    if(sub_category) {
      query.sub_category = sub_category;
    }
    const promotion_id = req.params.promotion_id;
    const promotion = await Promotion.findOne({
      _id: promotion_id,
      ...query,
    });

    if (!promotion) {
      return res
        .status(404)
        .json({ status: 404, success: false, error: "Promotion not found" });
    }

    return res.status(200).json({ status: 200, success: true, promotion });
  } catch (error) {
    console.error("Error retrieving promotion:", error);
    return res
      .status(500)
      .json({ status: 500, success: false, error: "Internal server error" });
  }
}

async function AddPromotion(req, res) {
  const { token, usernametoken } = req.headers;
  const modelQuery = req.query.modelQuery;
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }

  try {
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    const promotionData = req.body;
    promotionData.parent_admin_username = adminUsername;
    promotionData.parent_admin_role_type = type;
    promotionData.parent_admin_id=adminUsername;
    promotionData.site_auth_key = modelQuery.site_auth_key;
    const promotionExitsOrNot = await Promotion.findOne({
      category: promotionData.category,
      sub_category: promotionData.sub_category,
      ...modelQuery,
    });
    if (promotionExitsOrNot) {
      return res.status(400).json({
        status: 400,
        success: true,
        message: "Promotion Already Exit with Same Category and Sub Category ",
        promotion: null,
      });
    }

    const newPromotion = new Promotion(promotionData);
    await newPromotion.save();
    return res.status(201).json({
      status: 201,
      success: true,
      message: "Promotion added successfully",
      promotion: newPromotion,
    });
  } catch (error) {
    console.error("Error adding promotion:", error);
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
}

async function getActiveNewUserPromotions(database, dsa) {
  // Get current date and time
  const currentDate = new Date();

  // Fetch active promotions for new user bonus with current date and time within start and end dates
  return await database
    .collection("promotions")
    .find({
      category: "new user bonus",
      start_date: { $lte: currentDate },
      end_date: { $gte: currentDate },
      status: true,
      eligibility: dsa,
    })
    .toArray();
}

module.exports = {
  UpdatePromotion,
  DeletePromotion,
  UpdatePromotionStatus,
  GetAllPromotions,
  GetAllPromotionsUser,
  GetSinglePromotion,
  AddPromotion,
};
