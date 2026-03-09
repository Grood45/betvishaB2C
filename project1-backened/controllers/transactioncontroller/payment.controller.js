
const Admin = require("../../models/admin.model");
const { PaymentModel } = require("../../models/payment.model");
const { VerifyJwt } = require("../../utils/VerifyJwt");
const { imageLink } = require("../../utils/imgupload");

const Get_all_payment_method = async (req, res) => {
  const { parent_admin_id, parent_admin_role_type, parent_admin_username } =
    req.body;
  const { type } = req.query;
  const modelQuery=req.query.modelQuery
  let query = {...modelQuery, type};
  try {
    const methods = await PaymentModel.find({
      ...query,
      parent_admin_username,
      parent_admin_role_type,
      status: true,
    });

    if (!methods || methods.length === 0) {
      return res.status(200).json({
        status: 200,
        success: false,
        data: [],
        message: "No payment methods found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: methods,
      message: "Payment methods retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    // Handle any errors that occur during the database query
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error while getting payment methods",
    });
  }
};

const Get_all_payment_method_admin = async (req, res) => {
  const { type } = req.query;
  const { token, usernametoken } = req.headers;
  const modelQuery=req.query.modelQuery
  let query = {...modelQuery};
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens.",
    });
  }
  try {
    // Validate access token and verify token here
    const role_type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!role_type || !adminUsername) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    const methods = await PaymentModel.find({
      ...query,
      type,
      parent_admin_role_type: role_type,
      parent_admin_username: adminUsername,
    });

    if (!methods || methods.length === 0) {
      return res.status(200).json({
        status: 200,
        success: false,
        data: [],
        message: "No payment methods found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: methods,
      message: "Payment methods retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    // Handle any errors that occur during the database query
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error while getting payment methods",
    });
  }
};

const Add_Payment_method = async (req, res) => {
  try {
    const modelQuery=req.query.modelQuery
    const { token, usernametoken } = req.headers;
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const role_type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!adminUsername || !role_type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    const {
      gateway,
      currency,
      processing_time,
      image,
      max_limit,
      min_limit,
      instruction,
      admin_details,
      user_details,
      type,
      bonus,
      admin_id = "",
    } = req.body;

    if (
      !gateway ||
      !currency ||
      !processing_time ||
      !image ||
      !max_limit ||
      !min_limit ||
      !instruction ||
      !admin_details ||
      !user_details ||
      !type
    ) {
      return res.status(400).send({
        status: 400,
        success: false,
        message: "Request body cannot be empty",
      });
    }

    let payload = {
      gateway,
      currency,
      processing_time,
      image,
      max_limit,
      min_limit,
      instruction,
      admin_details,
      user_details,
      type,
      bonus,
      parent_admin_id: admin_id,
      parent_admin_username: adminUsername,
      parent_admin_role_type: role_type,
      site_auth_key:modelQuery.site_auth_key
    };

    const newGateWay = new PaymentModel(payload);
    await newGateWay.save();
    return res.status(201).json({
      status: 201,
      success: true,
      data: newGateWay,
      message: "Payment method added successfully",
    });
  } catch (error) {
    console.error(error, "Internal server error in add_payment Method");
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const get_image_link = async (req, res) => {
  try {
    const post_img = await imageLink(req, res);
    return res.status(200).json({
      status: 200,
      success: true,
      url: post_img,
      message: "Image url generate succesfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error while creating image url",
    });
  }
};

const Update_payment_method = async (req, res) => {
  try {
    const id = req.params._id;
    const payload = req.body;
    const modelQuery=req.query.modelQuery
    let query = {...modelQuery, _id: id};
    const existingMethod = await PaymentModel.findByIdAndUpdate(
      { ...query},
      payload
    );

    if (!existingMethod) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Payment method not found",
      });
    }

    // Send a success response
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Payment method updated successfully",
      data: existingMethod,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error while updating payment method",
    });
  }
};

const Update_payment_method_status = async (req, res) => {
  try {
    const id = req.params._id;
    const existingDocument = await PaymentModel.findById(id);
    const updatedStatus = !existingDocument.status;
    const modelQuery=req.query.modelQuery
    let query = {...modelQuery, _id: id};
    const updatedDocument = await PaymentModel.findByIdAndUpdate(
      { ...query },
      { status: updatedStatus },
      { new: true }
    );
    // Save the updated payment method to the database
    // Send a success response
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Payment method updated successfully",
      data: updatedDocument,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error while updating payment method",
    });
  }
};

const Delete_payment_method = async (req, res) => {
  try {
    const { id } = req.params;
    const modelQuery=req.query.modelQuery
    let query = {...modelQuery, _id: id};
    const paymentMethod = await PaymentModel.deleteOne({...query});
    if (!paymentMethod) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Payment method not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Payment method delete successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const Check_Admin_amount = async (req, res) => {
  try {
    const { parent_admin_role_type, parent_admin_username, amount } = req.body;
    const admin = await Admin.findOne({
      username: parent_admin_username,
      role_type: parent_admin_role_type,
    });
    if (!admin) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Admin not found.",
      });
    }

    if (admin.amount < amount) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Insufficient fund of upline, Contact upline.",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Proceed.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  Add_Payment_method,
  Get_all_payment_method,
  Update_payment_method,
  Delete_payment_method,
  get_image_link,
  Update_payment_method_status,
  Get_all_payment_method_admin,
  Check_Admin_amount,
};
