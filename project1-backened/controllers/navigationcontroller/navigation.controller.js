const Navigation = require("../../models/navigation.model");

const GetAllNavigationData = async (req, res) => {
  try {
    const { name } = req.query;
    const modelQuery = req.query.modelQuery;
    let query = modelQuery || {};
    if (name) {
      query.original_name = name;
    }
    const navigationData = await Navigation.find({ ...query });
    return res.status(200).json({
      status: 200,
      success: true,
      data: navigationData,
      message: "Navigation data retrieved successfully.",
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
    });
  }
};

const UpdateNavigationItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link, status, icon, data } = req.body;
    const modelQuery = req.query.modelQuery;
    let query = { ...modelQuery, _id: id };
    const updatedNavigationItem = await Navigation.findOneAndUpdate(
      query,
      {
        name,
        link,
        status,
        icon,
        data,
      },
      { new: true }
    );

    if (!updatedNavigationItem) {
      return res
        .status(404)
        .json({ success: false, message: "Navigation item not found" });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: updatedNavigationItem,
      message: "Navigation item updated successfully.",
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
    });
  }
};

const DeleteNavigationItem = async (req, res) => {
  try {
    const { id } = req.params;
    const modelQuery = req.query.modelQuery;
    let query = { ...modelQuery, _id: id };
    const updatedNavigationItem = await Navigation.deleteOne(query);
    if (!updatedNavigationItem) {
      return res
        .status(404)
        .json({ success: false, message: "Navigation item not found" });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: updatedNavigationItem,
      message: "Navigation item deleted successfully.",
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  UpdateNavigationItem,
  GetAllNavigationData,
  DeleteNavigationItem,
};
