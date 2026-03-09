const GameStructure = require("../../models/gamestructure.model");
// const data = require("../../urls.json");

function removeSpecial(str) {
  // Regular expression to match any character that is not a letter or a number
  const regex = /[^a-zA-Z0-9]/g;
  // Replace special characters and spaces with an empty string
  return str.replace(regex, '');
}

async function ProcessGameImages(gpId) {
  try {
    // Find all games
    let count = 0;
    for (const url of data) {
      try {
        const name = removeSpecial(url.split("-530x328-en")[0].split("blog%2F")[1]);
        let game = await GameStructure.findOne({ gameProviderId: gpId, "gameInfos.name": name });
        console.log(game.gameInfos[0].name, name);
        if (game.gameInfos[0] && game.gameInfos[0].name == name) {
          game.gameInfos[0].gameIconUrl = url;
          await game.save();
          count++;
        }
      } catch (error) {
        console.error("Error occurred for game:", error.message);
      }
    }
    console.log(count, "games processed");
  } catch (error) {
    console.error("Error occurred while processing game images:", error.message);
  }
}

module.exports = { ProcessGameImages };
