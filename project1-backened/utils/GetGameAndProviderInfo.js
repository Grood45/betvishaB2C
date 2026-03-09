const GetGameAndProviderInfo = (providerId, gameId) => {
    const gameInfo = data.find(entry => entry.gameProviderId === providerId && entry.gameID === gameId);
    if (gameInfo) {
      return {
        gameName: gameInfo.gameInfos[0].gameName,
        providerName: gameInfo.provider
      };
    } else {
      return null; // Return null if no matching game info is found
    }
  };

  module.exports={GetGameAndProviderInfo};