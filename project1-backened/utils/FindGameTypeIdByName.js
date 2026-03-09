const FindGameTypeIdByName = (gameType) => {
  const gameTypeValues = {
    100: "live casino",
    101: "baccarat",
    102: "blackjack",
    103: "roulette",
    104: "dragon tiger",
    105: "sicbo",
    106: "bull bull",
    107: "poker",
    108: "dice",
    109: "game show",
    200: "games lobby",
    201: "slots",
    202: "arcade games",
    203: "fishing games",
    204: "table games",
    205: "scratchcards",
    206: "virtual games",
    207: "jackpots",
    208: "other games",
    300: "sportsbook",
  };
  return gameTypeValues[gameType] || null;
};
module.exports = { FindGameTypeIdByName };
