const Commission = require("../../models/commission.model");
const { VerifyJwt } = require("../../utils/VerifyJwt");
async function UpdateCommission(req, res) {
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

    const commission_id = req.params.commission_id;
    const updates = req.body;
    const updatedCommission = await Commission.findOneAndUpdate(
      { _id: commission_id, ...query },
      updates,
      { new: true }
    );

    if (!updatedCommission) {
      return res
        .status(404)
        .json({ status: 404, success: false, error: "Commission not found" });
    }

    return res
      .status(200)
      .json({ status: 200, success: true, updatedCommission });
  } catch (error) {
    console.error("Error updating commission:", error);
    return res
      .status(500)
      .json({ status: 500, success: false, error: "Internal server error" });
  }
}

async function DeleteCommission(req, res) {
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

    const commission_id = req.params.commission_id;
    const deletedCommission = await Commission.findOneAndDelete({
      _id: commission_id,
      ...query,
    });

    if (!deletedCommission) {
      return res
        .status(404)
        .json({ status: 404, success: false, error: "Commission not found" });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Commission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting commission:", error);
    return res
      .status(500)
      .json({ status: 500, success: false, error: "Internal server error" });
  }
}

async function UpdateCommissionStatus(req, res) {
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

    const commission_id = req.params.commission_id;
    const { status } = req.body;
    const updatedCommission = await Commission.findOneAndUpdate(
      { _id: commission_id, ...query },
      { status },
      { new: true }
    );

    if (!updatedCommission) {
      return res
        .status(404)
        .json({ status: 404, success: false, error: "Commission not found" });
    }

    return res
      .status(200)
      .json({ status: 200, success: true, updatedCommission });
  } catch (error) {
    console.error("Error changing commission status:", error);
    return res
      .status(500)
      .json({ status: 500, success: false, error: "Internal server error" });
  }
}

async function GetAllCommissions(req, res) {
  const { token, usernametoken } = req.headers;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

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

    const commissions = await Commission.find(query)
      .limit(limit)
      .skip((page - 1) * limit);

    return res.status(200).json({
      status: 200,
      success: true,
      commissions,
    });
  } catch (error) {
    console.error("Error retrieving commissions:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
}

async function GetSingleCommission(req, res) {
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

    const commission_id = req.params.commission_id;
    const commission = await Commission.findOne({
      _id: commission_id,
      ...query,
    });

    if (!commission) {
      return res
        .status(404)
        .json({ status: 404, success: false, error: "Commission not found" });
    }

    return res.status(200).json({ status: 200, success: true, commission });
  } catch (error) {
    console.error("Error retrieving commission:", error);
    return res
      .status(500)
      .json({ status: 500, success: false, error: "Internal server error" });
  }
}

async function AddCommission(req, res) {
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
    const commissionData = req.body;
    commissionData.parent_admin_username = adminUsername;
    commissionData.parent_admin_role_type = type;
    const newCommission = new Commission(commissionData);
    await newCommission.save();
    return res
      .status(201)
      .json({
        status: 201,
        success: true,
        message: "Commission added successfully",
        commission: newCommission,
      });
  } catch (error) {
    console.error("Error adding commission:", error);
    return res
      .status(500)
      .json({ status: 500, success: false, error: "Internal server error" });
  }
}

module.exports = {
  UpdateCommission,
  DeleteCommission,
  UpdateCommissionStatus,
  GetAllCommissions,
  GetSingleCommission,
  AddCommission,
};
