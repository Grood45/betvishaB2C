const axios = require('axios');
const { ProviderModel } = require('../../models/providers/provider.model');

async function SaveProviderData(providerData) {
    try {
        const provider = new ProviderModel(providerData);
        await provider.save();
        console.log('Provider data saved:', providerData);
    } catch (error) {
        console.error('Error saving provider data:', error);
    }
}

async function GetDataFromDreamgates() {
    const url = 'https://sc4-api-en.dreamgates.net/v4/game/providers';
    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer 87cf4867-8978-49f3-ac9b-fa1911bec80f',
        'Content-Type': 'application/json'
    };
    const data = { 'lang': 1 };

    try {
        const response = await axios.post(url, data, { headers: headers });
        const providers = response.data.data;
        providers.forEach(provider => {
            const providerData = {
                provider_name: provider.provider_name,
                provider_id: provider.provider_id.toString(),
                status: provider.status === 1,
                api_provider_name: 'DREAMGATES'
            };
            SaveProviderData(providerData);
        });
    } catch (error) {
        console.error('Error fetching data from Dreamgates:', error);
        throw error;
    }
}

async function GetDataFromEvergame() {
    const url = 'https://api.evergame.org/api/casinoapi';
    const data = {
        'method': 'GetVendors',
        'token': 'QjhtZ04yNmw1QUZNOUNMUm5JSUdERkRiRC9OZ0xweW43Q05YcURaYXduUT06dG9ueXN0b25lczAxOA==',
        'agentCode': 'tonystones018'
    };

    try {
        const response = await axios.post(url, data);
        const vendors = response.data.vendors;
        vendors.forEach(vendor => {
            const providerData = {
                provider_name: vendor.vendorName,
                provider_id: vendor.vendorCode,
                provider_type: vendor.gameType.toString(),
                status: true, // Assuming status is always true as it's not specified in the response
                api_provider_name: 'EVERGAMES'
            };
            SaveProviderData(providerData);
        });
    } catch (error) {
        console.error('Error fetching data from Evergame:', error);
        throw error;
    }
}

async function GetDataFromNexusggreu() {
    const url = 'https://api.nexusggreu.com';
    const data = {
        'method': 'provider_list',
        'agent_code': 'toni018_TND',
        'agent_token': '8a9a4823a506547ed9202109269de68c'
    };
    try {
        const response = await axios.post(url, data);
        const providers = response.data.providers;
        providers.forEach(provider => {
            const providerData = {
                provider_name: provider.name,
                provider_id: provider.code,
                status: provider.status === 1,
                api_provider_name: 'NEXUSGGREU'
            };
            SaveProviderData(providerData);
        });
    } catch (error) {
        console.error('Error fetching data from Nexusggreu:', error);
        throw error;
    }
}

// 1

async function fetchAndInsertNexusggreuGames(provider, credentials) {
    const {
      api_url,
      api_token,
      site_auth_key,
      agent_code,
    } = credentials;
  
    try {
      const response = await axios.post(
        api_url,
        {
          "method": "game_list",
          "agent_code": agent_code,
          "agent_token": api_token,
          "provider_code": provider.provider_id
        }
      );
  
      const gameData = response.data;
      console.log(response.data, "res");
  
      if (gameData.status !== 1 || gameData.msg !== "SUCCESS") {
        throw new Error("Invalid response data");
      }
  
      const games = gameData.games.map((game) => ({
        game_name: game?.game_name,
        game_id: game.game_code,
        provider: provider.provider_name,
        provider_id: provider.provider_id,
        game_type: game?.game_type || "",
        provider_type: provider.provider_type,
        game_category: ["live"],
        image_url: game?.banner,
        priority: 1,
        currency: provider.currency,
        status: game.status,
        language: "en",
        site_auth_key: site_auth_key,
      }));
  
      await OtherGameModel.insertMany(games);
      console.log(`Games for provider ${provider.provider_name} inserted successfully`);
    } catch (error) {
      console.error(`Error fetching or inserting games for provider ${provider.provider_name}:`, error);
    }
  }
  
  async function fetchAndInsertNexusggreuAllProviders(req, res) {
    try {
      const credentials = req.body;
  
      if (!credentials.api_url || !credentials.api_token || !credentials.site_auth_key || !credentials.agent_code) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Missing required credentials in request body",
        });
      }
  
      const providers = await ProviderModel.find({ api_provider_name: "NEXUSGGREU" }).lean();
  
      for (const provider of providers) {
        await fetchAndInsertNexusggreuGames(provider, credentials);
      }
  
      res.status(200).json({
        status: 200,
        success: true,
        message: "Games fetched and inserted for all providers successfully",
      });
    } catch (error) {
      console.error("Error fetching providers or inserting games:", error);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
      });
    }
  }
  
// 2

  async function fetchAndInsertEvergameGames(provider, credentials) {
    const {
      api_url,
      api_token,
      site_auth_key,
      agent_code,
    } = credentials;
  
    try {
      const response = await axios.post(
        api_url,
        {
          method: "GetVendorGames",
          token: api_token,
          agentCode: "tonystones018",
          vendorCode: provider.provider_id
        },
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${api_token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const gameData = response.data;
      if (gameData.status !== 0 || gameData.msg!=="Success") {
        throw new Error("Invalid response data");
      }
  
      const games = gameData.vendorGames.map((game) => {
        const imageUrl = game.imageUrl ? JSON.parse(game.imageUrl).en : game.imageUrl;
        const gameName = game.gameName ? JSON.parse(game.gameName).en : game.gameName;
  
        return {
          game_name: gameName,
          game_id: game.gameCode,
          provider: JSON.parse(provider.provider_name).en||"",
          provider_id: provider.provider_id,
          game_type: game.gameType,
          provider_type: provider.provider_type,
          game_category: ["slots"],
          image_url: imageUrl,
          priority: 1,
          currency: provider.currency,
          status: true,
          language: "en",
          site_auth_key: site_auth_key,
        };
      });
  
      await OtherGameModel.insertMany(games);
      console.log(`Games for provider ${provider.provider_name} inserted successfully`);
    } catch (error) {
      console.error(`Error fetching or inserting games for provider ${provider.provider_name}:`, error);
    }
  }  
  
  
  async function fetchAndInsertEvergameAllProviders(req, res) {
    try {
      const credentials = req.body;
  
      if (!credentials.api_url || !credentials.api_token || !credentials.site_auth_key || !credentials.agent_code) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Missing required credentials in request body",
        });
      }
  
      const providers = await ProviderModel.find({ api_provider_name: "EVERGAME" }).lean();
  
      for (const provider of providers) {
        await fetchAndInsertEvergameGames(provider, credentials);
      }
  
      res.status(200).json({
        status: 200,
        success: true,
        message: "Games fetched and inserted for all providers successfully",
      });
    } catch (error) {
      console.error("Error fetching providers or inserting games:", error);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
      });
    }
  }


// 3
  async function fetchAndInsertDreamgatesGames(provider, credentials) {
    const {
      api_url,
      api_token,
      site_auth_key,
      agent_code,
    } = credentials;
  
    try {
      const response = await axios.post(
        api_url,
        {
          provider_id: provider.provider_id,
          lang: 1,
        },
        {
          headers: {
          ...req.headers
          },
        }
      );
  
      const gameData = response.data;
  
      if (gameData.code !== 0 || !gameData.data) {
        throw new Error("Invalid response data");
      }
  
      const games = gameData.data.map((game) => ({
        game_name: game.game_name,
        game_id: game?.game_code,
        provider: provider?.provider_name,
        provider_id: game?.provider_id,
        game_type: game?.category,
        provider_type:provider?.provider_name,
        game_category: [game?.category],
        image_url: game?.game_image,
        priority: 1,
        currency: provider?.currency,
        status: game?.launch_enable,
        language: "", // Add appropriate language if available
        site_auth_key: site_auth_key, // Add appropriate site_auth_key if available
      }));
  
      await OtherGameModel.insertMany(games);
      console.log(
        `Games for provider ${provider.provider_name} inserted successfully`
      );
    } catch (error) {
      console.error(
        `Error fetching or inserting games for provider ${provider.provider_name}:`,
        error
      );
    }
  }
  
  
  async function fetchAndInsertDreamgatesAllProviders(req, res) {
    try {
  
      const credentials = req.body;
  
      if (!credentials.api_url || !credentials.api_token || !credentials.site_auth_key || !credentials.agent_code) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Missing required credentials in request body",
        });
      }
  
      const providers = await ProviderModel.find({ api_provider_name: "DREAMGATES" }).lean();
  
      for (const provider of providers) {
        await fetchAndInsertDreamgatesGames(provider, credentials);
      }
  
      res.status(200).json({
        status: 200,
        success: true,
        message: "Games fetched and inserted for all providers successfully",
      });
    } catch (error) {
      console.error("Error fetching providers or inserting games:", error);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
      });
    }
  }
  

module.exports={GetDataFromDreamgates, GetDataFromEvergame, GetDataFromNexusggreu,fetchAndInsertNexusggreuAllProviders, fetchAndInsertEvergameAllProviders,fetchAndInsertEvergameGames,fetchAndInsertDreamgatesAllProviders}