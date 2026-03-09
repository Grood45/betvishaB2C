const OtherGameModel = require("../../../models/providers/game.model");
const { ProviderModel } = require("../../../models/providers/provider.model");
const ProviderInformationModel = require("../../../models/providers/providerdata/providerinformation.model");

const GetGames = async (req, res) => {
  const {
    category,
    provider_id,
    status,
    currency,
    provider,
    page = 1,
    pageSize = 10,
    api_provider_name,
  } = req.query;
  try {
    const { modelQuery={} } = req.query; // Assuming modelQuery is validated or sanitized
    const query = { ...modelQuery };
    if (category) query.category = { $in: category };
    if (provider_id) query.provider_id = provider_id;
    if (status !== undefined) query.status = status === "true";
    if (currency) query.currency = currency;
    if (provider) query.provider = provider;
    if(api_provider_name) query.api_provider_name=api_provider_name


    console.log(query,req.query, "fjihfififijikik")

    const totalGames = await OtherGameModel.countDocuments(query);
    const totalPages = Math.ceil(totalGames / pageSize);
    const games = await OtherGameModel.find(query)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    const pagination = {
      totalGames,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(pageSize),
    };

    res.status(200).json({
      status: 200,
      success: true,
      message: "Games retrieved successfully.",
      data: games,
      pagination: pagination,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};


const GetGameByGameCategory = async (req, res) => {
  const { game_category, page = 1, limit = 10 } = req.query;

  try {
    // Validate game_category
    if (!game_category) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Keyword is required'
      });
    }

    // Fetch active providers and collect their api_provider_name values
    const activeProviderInformations = await ProviderInformationModel.find({ status: true });
    const activeProviderNames = activeProviderInformations.map(provider => provider.provider_name);
    if (activeProviderNames.length === 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "No active providers found",
        data: [],
        pagination: {
          totalGames: 0,
          totalPages: 0,
          currentPage: parseInt(page),
          limit: parseInt(limit)
        },
        providers: []
      });
    }
    const providerQuery={ api_provider_name: { $in: activeProviderNames } }
    // Create query

    const activeProviders = await ProviderModel.find({ status: true });
    const activeProviderData = activeProviders.map(provider => provider.provider_id);

    const query = {
      game_category: { $in: [game_category] },
      provider_id: { $in: activeProviderData }
    };

    // Get total games count and paginated games in parallel
    const [totalGamesCount, games] = await Promise.all([
      OtherGameModel.countDocuments(query),
      OtherGameModel.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
    ]);

    const totalPages = Math.ceil(totalGamesCount / limit);

    const pagination = {
      totalGames: totalGamesCount,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit)
    };

    res.status(200).json({
      status: 200,
      success: true,
      message: "Games filtered successfully",
      data: games,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message
    });
  }
};

const ToggleGameStatus = async (req, res) => {
  const { id } = req.params;
  const { modelQuery={} } = req.query; // Assuming modelQuery is validated or sanitized

  try {
    // Step 1: Find the game by id
    let query = { _id: id };
    if (modelQuery) {
      query = { ...query, ...modelQuery };
    }

    const game = await OtherGameModel.findOne(query);

    // Step 2: Check if the game exists
    if (!game) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Game not found",
      });
    }

    // Step 3: Toggle the status
    game.status = !game.status;

    // Step 4: Update the game in the database
    const updatedGame = await game.save();

    // Step 5: Respond with success message and updated data
    res.status(200).json({
      status: 200,
      success: true,
      message: "Status updated successfully.",
      data: updatedGame,
    });
  } catch (error) {
    // Step 6: Handle errors
    console.error("Error toggling game status:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
};

const AddGames = async (req, res) => {
  const games = req.body; // Expect an array of game objects
  const modelQuery = req.query.modelQuery;
  const payload = { ...games, ...modelQuery };
  try {
    const newGames = new OtherGameModel(payload);
    await newGames.save();
    res.status(201).json({
      status: 201,
      success: true,
      message: "Games added successfully.",
      data: newGames,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateGamePriority = async (req, res) => {
  const { ids, values } = req.body;
  const modelQuery = req.query.modelQuery;
  let query = modelQuery || {};
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
    return OtherGameModel.updateOne({ _id: id, ...query }, updateOptions);
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

const UpdateGameImageById = async (req, res) => {
  try {
    const { id, provider_id } = req.params;
    const { image_url } = req.body;
    const modelQuery = req.query.modelQuery;
    let query = { ...modelQuery, _id: id, provider_id: provider_id };
    // Validate the status value
    if (image_url == "") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid image value.",
      });
    }
    // Find the game by its ID and update its status
    const updatedGame = await OtherGameModel.findOneAndUpdate(
      query,
      { $set: { image_url: image_url } },
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



const DeleteGameCategory = async (req, res) => {
    const { id } = req.params;
    const { category } = req.body;
    const modelQuery = req.query.modelQuery;
    let query ={ _id: id, ...modelQuery};
    try {
      const updatedGame = await OtherGameModel.findOneAndUpdate(
        query,
        { $pull: { game_category: category } },
        { new: true }
      );
      console.log(updatedGame, category,req.body, "knjnin")
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
  
  const AddGameCategory = async (req, res) => {
    const { id } = req.params;
    const { category } = req.body;
    const modelQuery = req.query.modelQuery;
    let query ={ _id: id, ...modelQuery};
    try {
      const game = await OtherGameModel.findOne(query);
  
      if (!game) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Game not found",
        });
      }
  
      if (game.game_category.includes(category)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Category already exists in the game",
        });
      }
  
      const updatedGame = await OtherGameModel.findByIdAndUpdate(
        query,
        { $addToSet: { game_category: category } },
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
  GetGames,
  GetGameByGameCategory,
  ToggleGameStatus,
  AddGames,
  UpdateGamePriority,
  UpdateGameImageById,
  AddGameCategory,
  DeleteGameCategory
};
