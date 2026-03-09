const axios = require('axios');
const User = require('../../../models/user.model');
const ProviderInformationModel = require('../../../models/providers/providerdata/providerinformation.model');

const errorResponse = (res, message) => {
  return res.status(400).json({
    status: 400,
    success: false,
    message,
  });
};

// Nexus API - User Create
const NexusCreateUser = async (req, res) => {

  const { agent, api} =req.query; 
  const { user_code } = req.body;

  if (!agent || !api || !user_code) {
    return errorResponse(res, 'Invalid payload');
  }

  try {
    const response = await axios.post('https://api.nexusggreu.com', {
      method: 'user_create',
      agent_code:agent,
      agent_token:api,
      user_code
    });

    const data = response.data;
    if (data.status === 1) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: data.msg,
        data: {
          user_code: data.user_code,
          user_balance: data.user_balance
        }
      });
    } else {
      return errorResponse(res, data.msg);
    }
  } catch (error) {
    return errorResponse(res, 'Request failed');
  }
};

// Nexus API - Game Launch
const NexusLaunchGame = async (req, res) => {
  const { agent,api} = req.query;
  const {  user_code, provider_code, game_code, lang="en" } = req.body;

  if (!agent || !api || !user_code || !provider_code || !game_code || !lang) {
    return errorResponse(res, 'Invalid payload');
  }

  try {
    const response = await axios.post('https://api.nexusggreu.com', {
      method: 'game_launch',
      agent_code:agent,
      agent_token:api,
      user_code,
      provider_code,
      game_code,
      lang
    });

    
    const data = response.data;
    if (data.status === 1) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: data.msg,
        data: {
          launch_url: data.launch_url
        }
      });
    } else {
      return errorResponse(res, data.msg);
    }
  } catch (error) {
    console.log(error)
    return errorResponse(res, 'Request failed');
  }
};

// Evergame API - Create User
const EvergameCreateUser = async (req, res) => {
  const { api, agent } = req.query;
  const { userCode } = req.body;

  if (!api || !agent|| !userCode) {
    return errorResponse(res, 'Invalid payload');
  }

  try {
    const response = await axios.post('https://api.evergame.org/api/casinoapi', {
      method: 'CreateUser',
      token:api,
      agentCode:agent,
      userCode
    });

    const data = response.data;
    if (data.status === 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: data.msg,
        data: {
          userCode: data.userCode
        }
      });
    } else {
      return errorResponse(res, data.msg);
    }
  } catch (error) {
    return errorResponse(res, 'Request failed');
  }
};

// Evergame API - Get Game URL
const EvergameGetGameUrl = async (req, res) => {
  console.log("ifhuieefuh")
  const { api, agent } = req.query
  const {userCode, vendorCode, language="en",nickName } = req.body;
  if (!api|| !agent || !userCode || !nickName || !vendorCode || !language) {
    return errorResponse(res, 'Invalid payload');
  }

  try {
    const response = await axios.post('https://api.evergame.org/api/casinoapi', {
      method: 'GetGameUrl',
      token:api,
      agentCode:agent,
      userCode,
      nickName,
      vendorCode,
      language
    });
    console.log(response)

    const data = response.data;
    if (data.status === 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: data.msg,
        data: {
          launchUrl: data.launchUrl
        }
      });
    } else {
      return errorResponse(res, data.msg);
    }
  } catch (error) {
    console.log(error)
    return errorResponse(res, 'Request failed');
  }
};

// Dreamgates API - Create User
const DreamgatesCreateUser = async (req, res) => {
  const { api }=req.query;
  const { name } = req.body;

  if (!name) {
    return errorResponse(res, 'Invalid payload');
  }

  try {
    const response = await axios.post('https://sc4-api-en.dreamgates.net/v4/user/create', {
      name
    }, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${api}`,
        'Content-Type': 'application/json'
      }
    });
    const data = response.data;
    const user = await User.findOneAndUpdate({username:name}, {user_code:data.data.user_code})
    if (data.code === 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: data.message,
        data: {
          user_code: data.data.user_code
        }
      });
    } else {
      return errorResponse(res, data.message);
    }
  } catch (error) {
    return errorResponse(res, 'Request failed');
  }
};

// Dreamgates API - Get Game URL
const DreamgatesGetGameUrl = async (req, res) => {
  // comming from query
  const {api}=req.query;
  const { user_code, provider_id, game_symbol, lang="en", win_ratio=70 } = req.body;
  if (!user_code || !provider_id || !game_symbol || !lang ) {
    return errorResponse(res, 'Invalid payload');
  }

  try {
    const response = await axios.post('https://sc4-api-en.dreamgates.net/v4/game/game-url', {
      user_code,
      provider_id,
      game_symbol,
      lang,
      win_ratio
    }, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${api}`,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    if (data.code === 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: data.message,
        data: {
          game_url: data.data.game_url
        }
      });
    } else {
      return errorResponse(res, data.message);
    }
  } catch (error) {
    return errorResponse(res, 'Request failed');
  }
};


// Individual Provider Functions for User Creation
const DreamgatesIndividualCreateUser = async (api, name) => {
  if (!name) throw new Error('Invalid payload');

  const response = await axios.post('https://sc4-api-en.dreamgates.net/v4/user/create', { name }, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${api}`,
      'Content-Type': 'application/json'
    }
  });

  const data = response.data;
  if (data.code !== 0) throw new Error(data.message);

  await User.findOneAndUpdate({ username: name }, { user_code: data.data.user_code });

  return { provider: 'DREAMGATES', user_code: data.data.user_code, message: data.message };
};

const EvergameIndividualCreateUser = async (api, agent, userCode) => {
  if (!api || !agent || !userCode) throw new Error('Invalid payload');

  const response = await axios.post('https://api.evergame.org/api/casinoapi', {
    method: 'CreateUser',
    token: api,
    agentCode: agent,
    userCode
  });

  const data = response.data;
  if (data.status !== 0) throw new Error(data.msg);

  return { provider: 'EVERGAME', userCode: data.userCode, message: data.msg };
};

const NexusIndividualCreateUser = async (agent, api, user_code) => {
  if (!agent || !api || !user_code) throw new Error('Invalid payload');

  const response = await axios.post('https://api.nexusggreu.com', {
    method: 'user_create',
    agent_code: agent,
    agent_token: api,
    user_code
  });

  const data = response.data;
  if (data.status !== 1) throw new Error(data.msg);

  return { provider: 'NEXUSGGREU', user_code: data.user_code, user_balance: data.user_balance, message: data.msg };
};

const CreateSecondaryGameUser = async (req, res) => {
  const { userCode, currency } = req.body;
  try {
    const providerData = await ProviderInformationModel.find({ currency });
    if (!providerData.length) {
      return res.status(404).json({ error: 'No providers found for the specified currency' });
    }

    const createUserPromises = providerData.map(async (provider) => {
      const { provider_name, api_token, agent_code } = provider;
      try {
        switch (provider_name) {
          case 'DREAMGATES':
            return await DreamgatesIndividualCreateUser(api_token, userCode);
          case 'EVERGAME':
            return await EvergameIndividualCreateUser(api_token, agent_code, userCode);
          case 'NEXUSGGREU':
            return await NexusIndividualCreateUser(agent_code, api_token, userCode);
          default:
            throw new Error('Unsupported provider');
        }
      } catch (error) {
        return { provider: provider_name, success: false, error: error.message };
      }
    });

    // Wait for all promises to resolve
    const results = await Promise.allSettled(createUserPromises);

    const successResponses = results
      .filter(result => result.status === 'fulfilled' && result.value.success !== false)
      .map(result => result.value);

    const errorResponses = results
      .filter(result => result.status === 'rejected' || result.value.success === false)
      .map(result => result.reason || result.value);

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'User creation process completed',
      data: {
        successes: successResponses,
        errors: errorResponses
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: 'An error occurred during user creation',
      error: error.message
    });
  }
};

module.exports = {
  NexusCreateUser,
  NexusLaunchGame,
  EvergameCreateUser,
  EvergameGetGameUrl,
  DreamgatesCreateUser,
  DreamgatesGetGameUrl,
  CreateSecondaryGameUser
};