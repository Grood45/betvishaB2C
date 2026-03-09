const GameNavigation = require("../../models/gamenavigation.model");


const GetALLGameNavigationData = async (req, res) => {
  try {
    const modelQuery = req.query.modelQuery;
    let query = modelQuery||{};
    const gameNavigationData = await GameNavigation.find(query);
    return res.status(200).json({
      status: 200,
      success: true,
      data: gameNavigationData,
      message: "Navigation data retrieved successfully.",
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message:error.message
    });
  }
};

const UpdateGameNavigationItem = async (req, res) => {
  try {
    const { id } = req.params;
    const modelQuery = req.query.modelQuery;
    let query = {...modelQuery,_id:id};
    const { name, link, status, icon } = req.body;
    const updatedGameNavigationItem = await GameNavigation.findOneAndUpdate(
      query,
      {
        name,
        link,
        status,
        icon,
      },
      { new: true }
    );

    if (!updatedGameNavigationItem) {
      return res
        .status(404)
        .json({ success: false, message: "Navigation item not found" });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: updatedGameNavigationItem,
      message: "Navigation item updated successfully.",
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message
    });
  }
};

const AddGameNavigation = async (req, res) => {
  try {
    const { name, link, icon, original_name } = req.body;
    const modelQuery = req.query.modelQuery;
    const query=modelQuery
    // Validate required fields
    if (!name || !link || !icon ||!original_name) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "All fields are required."
      });
    }
    const newGameNavigationItem = new GameNavigation({
      name,
      link,
      icon,
      original_name,
      ...query

    });
    await newGameNavigationItem.save();
    return res.status(200).json({
      status: 200,
      success: true,
      data: newGameNavigationItem,
      message: "Navigation item created successfully."
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message:error.message
    });
  }
};

const DeleteGameNavigation = async (req, res) => {
  try {
    const { id } = req.params;
    const modelQuery = req.query.modelQuery;
    const query={...modelQuery, _id:id}
    // Find the navigation item by ID and delete it
    const deletedNavigationItem = await GameNavigation.findOneAndDelete(query);

    // Check if the navigation item exists
    if (!deletedNavigationItem) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Navigation item not found."
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: deletedNavigationItem,
      message: "Navigation item deleted successfully."
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message:error.message
    });
  }
};



module.exports = { GetALLGameNavigationData, UpdateGameNavigationItem, AddGameNavigation,DeleteGameNavigation };
