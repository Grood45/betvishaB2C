const ProviderInformationModel = require("../../../models/providers/providerdata/providerinformation.model");
const { VerifyJwt } = require("../../../utils/VerifyJwt");
require("dotenv").config();
// Get Data

const GetProviderInformation = async (req, res) => {
  try {
    const {
      agent_code,
      status,
      currency,
      provider_name,
      modelQuery = {},
    } = req.query;

    // Build the query object based on provided filters
    const query = { ...modelQuery };
    if (agent_code) query.agent_code = agent_code;
    if (status) query.status = status === "true"; // Convert status to boolean
    if (currency) query.currency = currency;
    if (provider_name) query.provider_name = provider_name;

    console.log(query);
    const data = await ProviderInformationModel.find(query);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Data retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: "Failed to retrieve data",
      error: error.message,
    });
  }
};

// Get Authorized Provider Information status

const GetAuthorizedProviderInformation = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!adminUsername || type !== process.env.OWNER_ROLETYPE||!type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    const { modelQuery = {} } = req.query;
    const query = { ...modelQuery };
    const data = await ProviderInformationModel.find({
      ...query,
      status: true,
    }).select("provider_name currency status modified_api_provider_name");

    if (!data || data.length === 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No data found",
        data: [],
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Data retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: "Failed to retrieve data",
      
    });
  }
};

// Add new data
const AddProviderInformation = async (req, res) => {
  try {
    const { modelQuery } = req.query;
    const payload = { ...req.body, ...modelQuery };
    const newData = new ProviderInformationModel(payload);

    // Validate the new data against the schema
    const validationError = newData.validateSync();
    if (validationError) {
      throw new Error(validationError.message);
    }
    await newData.save();
    res.status(200).json({
      status: 200,
      success: true,
      message: "Data added successfully",
      data: newData,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
      error: error.message,
    });
  }
};

// Update status
const UpdateProviderInformationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { modelQuery } = req.query;
    const { status } = req.body;
    const query = { ...modelQuery, _id: id };
    // Validate status update
    const updatedData = await ProviderInformationModel.findOneAndUpdate(
      query,
      { status },
      { new: true }
    );
    if (!updatedData) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Data not found",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Status updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 400,
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// Update existing data
const UpdateProviderInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const { modelQuery } = req.query;
    const query = { ...modelQuery, _id: id };
    // Validate update against the schema
    const validationError = new ProviderInformationModel(
      req.body
    ).validateSync();
    if (validationError) {
      throw new Error(validationError.message);
    }

    const updatedData = await ProviderInformationModel.findByIdAndUpdate(
      query,
      req.body,
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Data not found",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Data updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.log(error, "eerr");
    res.status(400).json({
      status: 400,
      success: false,
      message: "Failed to update data",
      error: error.message,
    });
  }
};

module.exports = {
  GetProviderInformation,
  GetAuthorizedProviderInformation,
  AddProviderInformation,
  UpdateProviderInformationStatus,
  UpdateProviderInformation,
};
