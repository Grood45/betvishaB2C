const GameStructure = require("../../models/gamestructure.model");
const { FindGameTypeIdByName } = require("../../utils/FindGameTypeIdByName");
const CasinoProvider = require("../../models/casinoprovider.model");
const GetAllGamesByProviderId = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search, category } = req.query;
    const { provider_id } = req.params;
    const modelQuery = req.query.modelQuery;
    // Define query conditions based on providerId, status, and search
    const query = { gameProviderId: +provider_id, ...modelQuery };
    if (status) {
      query.status = status == "true" ? true : false;
    }
    if(category){
      query.category={ $in: [category] }
    }
    if (search) {
      query["$or"] = [
        { "gameInfos.language": { $regex: search, $options: "i" } },
        { "gameInfos.gameName": { $regex: search, $options: "i" } },
      ];
    }
    // Apply pagination
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    const skip = (options.page - 1) * options.limit; // Calculate skip based on options
    // Fetch data from the database based on the query conditions and pagination options
    const games = await GameStructure.aggregate([
      { $match: query }, // Match your query criteria here
      { $addFields: { priorityNumeric: { $toInt: "$priority" } } }, // Convert priority to numeric
      { $sort: { priorityNumeric: 1 } }, // Sort by the numeric priority field
      { $skip: skip }, // Skip documents
      { $limit: options.limit }, // Limit the number of documents returned
      { $project: { priorityNumeric: 0 } }, // Remove the temporary numeric field after sorting
    ]);

    // Log the number of documents retrieved
    console.log("Number of documents retrieved:", games.length);

    // Count total items for pagination
    const totalItems = await GameStructure.countDocuments(query);

    // Log the total number of items
    console.log("Total items:", totalItems);

    // Count active and inactive games using aggregation pipeline
    const [activeGameCount, inActiveGameCount] = await Promise.all([
      GameStructure.countDocuments({
        gameProviderId: provider_id,
        status: true,
      }),
      GameStructure.countDocuments({
        gameProviderId: provider_id,
        status: false,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / options.limit);

    // Construct pagination object
    const pagination = {
      totalItems,
      totalPages,
      currentPage: options.page,
      limit: options.limit,
    };

    return res.status(200).json({
      status: 200,
      data: games,
      success: true,
      pagination,
      gameCounts: {
        activeGameCount,
        inActiveGameCount,
      },
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

const UpdateGameStatusById = async (req, res) => {
  try {
    const { game_id, provider_id } = req.params;
    const { status } = req.body;
    const modelQuery = req.query.modelQuery;
    let query = { ...modelQuery, gameID: game_id, gameProviderId: provider_id };
    // Validate the status value
    if (typeof status !== "boolean") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid status value. Please provide a boolean value.",
      });
    }

    // Find the game by its ID and update its status
    const updatedGame = await GameStructure.findOneAndUpdate(
      query,
      { status },
      { new: true }
    );

    if (!updatedGame) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Game not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Game status updated successfully",
      data: updatedGame,
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

const UpdateGameImageById = async (req, res) => {
  try {
    const { game_id, provider_id } = req.params;
    const { image_url } = req.body;
    const modelQuery = req.query.modelQuery;
    let query = { ...modelQuery, gameID: game_id, gameProviderId: provider_id };
    // Validate the status value
    if (image_url == "") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid image value.",
      });
    }
    const gameInfoIndex = 0;
    // Find the game by its ID and update its status
    const updatedGame = await GameStructure.findOneAndUpdate(
        query,
      { $set: { [`gameInfos.${gameInfoIndex}.gameIconUrl`]: image_url } },
      { new: true }
    );

    if (!updatedGame) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Game not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Game status updated successfully",
      data: updatedGame,
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

const GetGamesByGameType = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;

    const modelQuery = req.query.modelQuery;
    let query1 = { ...modelQuery, status: true};
    if (!category) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Category value is required.",
      });
    }
    const results = await CasinoProvider.find(query1).select("gpId");
    const gpIds = results.map((provider) => provider.gpId);
    // console.log(gpIds)
    // Construct query conditions
    const query = {
      category: { $in: [category] },
      isEnabled: true,
      ...query1,
      gameProviderId: { $in: gpIds },
    };
    // console.log(query, "eeji")
    // Add search functionality
    if (search) {
      query["$or"] = [
        { "gameInfos.language": { $regex: search, $options: "i" } },
        { "gameInfos.gameName": { $regex: search, $options: "i" } },
      ];
    }
    // Apply pagination
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    const skip = (options.page - 1) * options.limit; // Calculate skip based on options
    // Fetch data from the database based on the query conditions and pagination options
    const games = await GameStructure.aggregate([
      { $match: query }, // Match your query criteria here
      { $addFields: { priorityNumeric: { $toInt: "$priority" } } }, // Convert priority to numeric
      { $sort: { priorityNumeric: 1 } }, // Sort by the numeric priority field
      { $skip: skip }, // Skip documents
      { $limit: options.limit }, // Limit the number of documents returned
      { $project: { priorityNumeric: 0 } }, // Remove the temporary numeric field after sorting
    ]);

    // Count total items for pagination
    const totalItems = await GameStructure.countDocuments(query);
    const totalPages = Math.ceil(totalItems / options.limit);

    // Construct pagination object
    const pagination = {
      totalItems,
      totalPages,
      currentPage: options.page,
      limit: options.limit,
    };

    return res.status(200).json({
      status: 200,
      success: true,
      data: games,
      pagination,
      message: "Games retrieved successfully.",
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

const GetPopularGames = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    // Construct base query conditions
    const modelQuery = req.query.modelQuery;
    let query1 = { ...modelQuery, status: true};
    const results = await CasinoProvider.find(query1).select("gpId");
    const gpIds = results.map((provider) => provider.gpId);
    const query = {
      category: { $in: ["popular"] },
      gameProviderId: { $in: gpIds },
      isEnabled: true,
      ...query1
    };

    // Add search functionality if search term is provided
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { "gameInfos.language": searchRegex },
        { "gameInfos.gameName": searchRegex },
      ];
    }

    // Apply pagination options
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
    };
    const skip = (options.page - 1) * options.limit; // Calculate skip based on options
    // Fetch paginated games and count total items concurrently
    const [games, totalItems] = await Promise.all([
      // Fetch data from the database based on the query conditions and pagination options
      GameStructure.aggregate([
        { $match: query }, // Match your query criteria here
        { $addFields: { priorityNumeric: { $toInt: "$priority" } } }, // Convert priority to numeric
        { $sort: { priorityNumeric: 1 } }, // Sort by the numeric priority field
        { $skip: skip }, // Skip documents
        { $limit: options.limit }, // Limit the number of documents returned
        { $project: { priorityNumeric: 0 } }, // Remove the temporary numeric field after sorting
      ]),
      GameStructure.countDocuments(query),
    ]);
    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalItems / options.limit);
    // Construct pagination object
    const pagination = {
      totalItems,
      totalPages,
      currentPage: options.page,
      limit: options.limit,
    };

    // Return response with retrieved games, pagination info, and success message
    return res.status(200).json({
      status: 200,
      success: true,
      data: games,
      pagination,
      message: "Games retrieved successfully.",
    });
  } catch (error) {
    // Handle errors gracefully
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};
const GetTopGames = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const modelQuery = req.query.modelQuery;
    let query1 = { ...modelQuery, status: true};
    // Construct base query conditions
    const results = await CasinoProvider.find(query1).select("gpId");
    const gpIds = results.map((provider) => provider.gpId);
    const query = {
      category: { $in: ["top"] },
      gameProviderId: { $in: gpIds },
      isEnabled: true,
      ...query1
    };
    // Add search functionality if search term is provided
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { "gameInfos.language": searchRegex },
        { "gameInfos.gameName": searchRegex },
      ];
    }

    // Apply pagination options
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
    };

    // Fetch paginated games and count total items concurrently
    const skip = (options.page - 1) * options.limit; // Calculate skip based on options
    const [games, totalItems] = await Promise.all([
      GameStructure.aggregate([
        { $match: query },
        { $addFields: { priorityNumeric: { $toInt: "$priority" } } },
        { $sort: { priorityNumeric: 1 } },
        { $skip: skip },
        { $limit: options.limit },
        { $project: { priorityNumeric: 0 } },
      ]),
      GameStructure.countDocuments(query),
    ]);

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalItems / options.limit);

    // Construct pagination object
    const pagination = {
      totalItems,
      totalPages,
      currentPage: options.page,
      limit: options.limit,
    };
    return res.status(200).json({
      status: 200,
      success: true,
      data: games,
      pagination,
      message: "Games retrieved successfully.",
    });
  } catch (error) {
    // Handle errors gracefully
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllGames = async (req, res) => {
  try {
    const { page = 1, limit = 28, search } = req.query;
    // Construct query conditions
    const modelQuery = req.query.modelQuery;
    let query1 = { ...modelQuery, status: true};
    const results = await CasinoProvider.find(query1).select("gpId");
    const gpIds = results.map((provider) => provider.gpId);
    const query = {
      category: { $in: ["all games"] },
      gameProviderId: { $in: gpIds },
      isEnabled: true,
      ...query1
     };
    // Add search functionality
    if (search) {
      query["$or"] = [
        { "gameInfos.language": { $regex: search, $options: "i" } },
        { "gameInfos.gameName": { $regex: search, $options: "i" } },
      ];
    }
    console.log("jojonj");
    // Apply pagination
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 28,
    };
    const skip = (options.page - 1) * options.limit;

    // Fetch paginated games and count total items
    const gamesQuery = await GameStructure.aggregate([
      { $match: query }, // Match your query criteria here
      { $addFields: { priorityNumeric: { $toInt: "$priority" } } }, // Convert priority to numeric
      { $sort: { priorityNumeric: 1 } }, // Sort by the numeric priority field
      { $skip: skip }, // Skip documents
      { $limit: options.limit }, // Limit the number of documents returned
      { $project: { priorityNumeric: 0 } }, // Remove the temporary numeric field after sorting
    ]);
    // Count total items (without skipping and limiting)
    const totalItemsQuery = GameStructure.countDocuments(query);
    // Execute queries concurrently
    const [games, totalItems] = await Promise.all([
      gamesQuery,
      totalItemsQuery,
    ]);
    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalItems / options.limit);

    // Construct pagination object
    const pagination = {
      totalItems,
      totalPages,
      currentPage: options.page,
      limit: options.limit,
    };

    return res.status(200).json({
      status: 200,
      success: true,
      data: games,
      pagination,
      message: "Games retrieved successfully.",
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

const GetAllGameStructureData = async (name) => {
  try {
    // Remove special characters from the input name
    const cleanedQueryName = removeSpecialCharacters(name);

    let query = {};
    if (cleanedQueryName) {
      // Generate a regex pattern for the cleaned query name
      const regexPattern = generateRegexPattern(cleanedQueryName);
      // Apply the regex pattern to the game name in the MongoDB query
      query["gameInfos.0.gameName"] = { $regex: regexPattern, $options: "i" };
    }
    const gameStructureData = await GameStructure.find(query);
    return gameStructureData;
  } catch (error) {
    console.error("Error occurred:", error.message);
    throw error;
  }
};

// Function to remove special characters from a string
function removeSpecialCharacters(str) {
  return str.replace(/[^\w\s]/g, "");
}

// Function to generate a regex pattern from a string, allowing flexibility in matching
function generateRegexPattern(str) {
  const escapedStr = str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const pattern = escapedStr.split("").join(".*");
  return pattern;
}

// Function to generate a regex pattern from a string, allowing flexibility in matching
function generateRegexPattern(str) {
  // Escape special characters in the input string
  const escapedStr = str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // Create a regex pattern that matches the input string with any characters in between
  const pattern = escapedStr.split("").join(".*");
  return pattern;
}

// Controller to update multiple documents with priorities
const UpdatePriority = async (req, res) => {
  const { ids, values } = req.body;
  const modelQuery = req.query.modelQuery;
  let query =modelQuery||{};
  if (!ids || !values || ids.length !== values.length) {
    return res
      .status(400)
      .json({ status: 400, success: true, message: "Invalid payload" });
  }
  const updatePromises = ids.map(async (id, index) => {
    const updateOptions = {
      $set: {
        priority: values[index],
      },
    };
    return GameStructure.updateOne({ _id: id, ...query }, updateOptions);
  });

  try {
    await Promise.all(updatePromises);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Priority updated successfully",
    });
  } catch (error) {
    console.error("Error updating documents:", error);
    res
      .status(500)
      .json({ status: 500, success: true, message: error.message });
  }
};

const DeleteCategory = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  const modelQuery = req.query.modelQuery;
  let query ={ _id: id, ...modelQuery};
  try {
    const updatedGame = await GameStructure.findByIdAndUpdate(
      query,
      { $pull: { category: category } },
      { new: true }
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "Category deleted successfully",
      game: updatedGame,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

const AddCategory = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  const modelQuery = req.query.modelQuery;
  let query ={ _id: id, ...modelQuery};
  try {
    const game = await GameStructure.findById(id);

    if (!game) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Game not found",
      });
    }

    if (game.category.includes(category)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Category already exists in the game",
      });
    }

    const updatedGame = await GameStructure.findByIdAndUpdate(
      query,
      { $addToSet: { category: category } },
      { new: true }
    );

    res.status(200).json({
      status: 200,
      success: true,
      message: "Category added successfully",
      game: updatedGame,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  GetAllGamesByProviderId,
  UpdateGameStatusById,
  UpdateGameImageById,
  GetGamesByGameType,
  GetPopularGames,
  GetTopGames,
  GetAllGames,
  GetAllGameStructureData,
  UpdatePriority,
  DeleteCategory,
  AddCategory,
};
