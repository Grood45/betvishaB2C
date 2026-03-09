const CasinoProvider = require("../../models/casinoprovider.model");
const axios = require("axios");
const GameStructure = require("../../models/gamestructure.model");
async function fetchGameData(providerId) {
  try {
    const apiUrl =
      `${process.env.CASINO_BASE_URL}/web-root/restricted/information/get-game-list.aspx`;
    const payload = {
      GpId: providerId,
      IsGetAll: false,
      CompanyKey: process.env.COMPANY_KEY,
      ServerId: process.env.SERVER_ID,
    };

    const response = await axios.post(apiUrl, payload);
    const responseData = response?.data?.seamlessGameProviderGames || [];
    // console.log(response, "ress")
    return responseData;
  } catch (error) {
    console.error("Error occurred:", error.message);
    return [];
  }
}

const ProcessNewCasinoGames = async () => {
  try {
    const providerData = await CasinoProvider.find({gpId:1025});
    const updatedData = await Promise.all(
      providerData.map(async (entry) => {
        const gamesData = await fetchGameData(entry.gpId);
        // Assuming gamesData is an array of game objects
        for (const game of gamesData) {
          const updatedGamesNew = UpdateGameDataWithEnglishInfo(game);
          // Check if the game already exists in the database
          const existingGame = await GameStructure.findOne({
            gameProviderId: game.gameProviderId,
            gameID: game.gameID,
          });
          // if (existingGame) {
          //   // Update the existing game
          //   const updatedGames = UpdateGameDataWithEnglishInfo(existingGame);
          //   await GameStructure.updateOne(
          //     { gameProviderId: game.gameProviderId, gameID: game.gameID },
          //     updatedGames
          //   );
          // } else {
            // Add the new game
            await GameStructure.create(updatedGamesNew);
          // }
        }
        return entry;
      })
    );

    console.log("All games details have been updated:", updatedData);
  } catch (error) {
    console.error("Error occurred:", error.message);
  }
};

function UpdateGameDataWithEnglishInfo(gameData) {
  // Check if gameInfos array exists and is not empty
  if (gameData.gameInfos && gameData.gameInfos.length > 0) {
    let foundEnglishInfo = false;
    // Iterate through gameInfos array
    for (let i = 0; i < gameData.gameInfos.length; i++) {
      // Check if language is "en" or "EN"
      if (gameData.gameInfos[i].language.toLowerCase() === "en") {
        gameData.gameInfos = [gameData.gameInfos[i]]; // Update gameInfos array with only English info
        foundEnglishInfo = true;
        break;
      }
    }
    // If "en" language not found, update gameInfos with the first game info
    if (!foundEnglishInfo && gameData?.gameInfos) {
      gameData.gameInfos = [gameData.gameInfos[0]];
    }
  } else {
    // If gameInfos array is empty or doesn't exist, return null
    gameData.gameInfos = [
      {
        gameIconUrl:
          "https://playzilla.com/dimg/game/1701337012074_itssharktimebanner400x600.png?extension=avif&height=300",
        gameName: "Casino",
        language: "en",
      },
    ];
  }
  return gameData;
}




module.exports = { ProcessNewCasinoGames };
