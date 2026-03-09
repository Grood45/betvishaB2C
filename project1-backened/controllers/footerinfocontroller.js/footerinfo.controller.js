const FooterInfo = require("../../models/footerinfo.model");

const GetFooterInfo = async (req, res) => {
  try {
    const modelQuery=req.query.modelQuery
    const footerInfo = await FooterInfo.findOne(modelQuery); // Assuming there's only one document
    if (!footerInfo) {
      return res
        .status(200)
        .json({ success: false, message: "Footer info not found", data:[] });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      data: footerInfo,
      message: "Footer info retrieved successfully.",
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateFooterInfo = async (req, res) => {
  try {
    const modelQuery=req.query.modelQuery
    const footerInfo = req.body; // Assuming the entire footer data object is sent in the request body
    const updatedFooterInfo = await FooterInfo.findOneAndUpdate(modelQuery,
      footerInfo,
      { new: true } // Create a new document if none exists
    );

    if (!updatedFooterInfo) {
      return res
        .status(404)
        .json({ success: false, message: "Footer data not found" });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: updatedFooterInfo,
      message: "Footer info updated successfully.",
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};
module.exports = { GetFooterInfo, UpdateFooterInfo };
