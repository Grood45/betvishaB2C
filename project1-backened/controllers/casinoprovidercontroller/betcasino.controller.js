// controllers/gameController.js

const axios = require("axios");

const GetGames = async (req, res) => {
  const token = "87cf4867-8978-49f3-ac9b-fa1911bec80f";
  const { provider_id, page = 1, limit = 10 } = req.query;
  const data = {
    provider_id: provider_id,
    lang: 1,
  };

  try {
    const response = await axios.post(
      "https://sc4-api-en.dreamgates.net/v4/game/games",
      data,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Extract games data
    const games = response.data.data || [];

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedGames = games.slice(startIndex, endIndex);

    // Pagination information
    const totalItems = games.length;
    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    };

    res.status(200).json({
      status: 200,
      data: paginatedGames,
      success: true,
      pagination,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status:500,
      message: "Error making request to the games endpoint",
      error: error.message,
    });
  }
};

const GetProviders = async (req, res) => {
  const token = "87cf4867-8978-49f3-ac9b-fa1911bec80f";
  const data = {
    lang: 1,
  };
  try {
    const response = await axios.post(
      "https://sc4-api-en.dreamgates.net/v4/game/providers",
      data,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({
      success: true,
      providers: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error making request to the providers endpoint",
      error: error.message,
    });
  }
};

const GetGameUrl = async (req, res) => {
  const {url="https://sc4-api-en.dreamgates.net/v4/game/game-url", token="87cf4867-8978-49f3-ac9b-fa1911bec80f"}=req.query;
  const { user_code, provider_id, game_symbol, lang, win_ratio } = req.body;

  const data = {
    user_code: user_code,
    provider_id: provider_id,
    game_symbol: game_symbol,
    lang: lang,
    win_ratio: win_ratio,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json({
      status: 200,
      data: response.data,
      success: true,
      message:"Success."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error making request to the game URL endpoint",
      error: error.message,
    });
  }
};

module.exports = { GetGames, GetProviders, GetGameUrl };
