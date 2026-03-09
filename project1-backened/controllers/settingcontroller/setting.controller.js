const Setting = require("../../models/setting.model");

const UpdateSetting = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the market document by ID
    const payload = req.body;
    const modelQuery=req.query.modelQuery
    const query=modelQuery
    const logo = await Setting.findOneAndUpdate(query, payload, {
      new: true,
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Setting details update successfully",
      data: logo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetSetting = async (req, res) => {
  try {
    const modelQuery=req.query.modelQuery
    const query=modelQuery
    const logo = await Setting.findOne(query);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Setting details retrived successfully",
      data: logo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};
module.exports = { UpdateSetting, GetSetting };
