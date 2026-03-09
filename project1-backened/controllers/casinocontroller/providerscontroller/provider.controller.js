const OtherGameModel = require("../../../models/providers/game.model");
const { ProviderModel } = require("../../../models/providers/provider.model");

const ToggleProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { modelQuery = {} } = req.query;
    // Ensure modelQuery is an object
    const query = { ...modelQuery, _id: id };
    const provider = await ProviderModel.findOne(query);
    if (!provider) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Provider not found.",
      });
    }

    provider.status = !provider.status;
    await provider.save();

    res.status(200).json({
      status: 200,
      success: true,
      message: "Status toggled successfully.",
      data: provider,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetProvider = async (req, res) => {
    try {
      const { search, status, currency,api_provider_name="", page = 1, limit = 10, modelQuery = {}, sort=1 } = req.query;
      // Ensure modelQuery is an object
      const query = { ...modelQuery };
       if(api_provider_name){
        query.api_provider_name=api_provider_name
       }
      if (status) {
        query.status = status === "true";
      }
  
      if (currency) {
        query.currency = currency;
      }
  
      if (search) {
        query.$or = [
          { provider_name: { $regex: new RegExp(search, "i") } },
          { provider_id: { $regex: new RegExp(search, "i") } },
          { provider_type: { $regex: new RegExp(search, "i") } },
          { game_name: { $regex: new RegExp(search, "i") } },
          { provider: { $regex: new RegExp(search, "i") } },
        ];
      }
  
      // Pagination
      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * pageSize;
  
      // Perform the main query and count queries in parallel
      const [allProviders, totalCount, activeProviders, inactiveProviders] =
        await Promise.all([
          ProviderModel.find(query)
            .sort({ priority: sort })
            .skip(skip)
            .limit(pageSize),
          ProviderModel.countDocuments(query),
          ProviderModel.countDocuments({ status: true, ...modelQuery }),
          ProviderModel.countDocuments({ status: false, ...modelQuery }),
        ]);
  
      if (!allProviders || allProviders.length === 0) {
        return res.status(200).json({
          status: 200,
          success: false,
          message: "Provider not found.",
          data: [],
        });
      }
  
      // Pagination object
      const totalPages = Math.ceil(totalCount / pageSize);
      const pagination = {
        totalProviders: totalCount,
        totalPages,
        currentPage: pageNumber,
        limit: pageSize,
      };
  
      res.status(200).json({
        status: 200,
        success: true,
        message: "Provider retrieved successfully.",
        data: allProviders,
        pagination: pagination,
        providerCounts: {
          activeCount: activeProviders,
          inactiveCount: inactiveProviders,
          totalCount: totalCount,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        success: false,
        message: error.message,
      });
    }
};
const GetProviderName = async (req, res) => {
  try {
    const { search, api_provider_name, currency } = req.query;
    
    const query = {};
    if (api_provider_name) {
      query.api_provider_name = api_provider_name;
    }
    if (currency) {
      query.currency = currency;
    }
    if (search) {
      query.provider_name = { $regex: new RegExp(search, "i") };
    }

    const providers = await ProviderModel.find(query, 'provider_name');

    const providerNames = providers.map(provider => {
      const providerName = provider.provider_name;
      if (typeof providerName === 'string') {
        try {
          const parsedProviderName = JSON.parse(providerName);
          return parsedProviderName.en || providerName;
        } catch (error) {
          return providerName;
        }
      }
      return providerName;
    });

    if (!providerNames.length) {
      return res.status(200).json({
        status: 200,
        success: false,
        message: "Provider not found.",
        data: [],
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Provider retrieved successfully.",
      data: providerNames,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateProviderPriority = async (req, res) => {
  try {
    const { value, gpid } = req.body;
    // Check for valid payload
    const modelQuery = req.query.modelQuery;
    const query = modelQuery;
    if (!gpid || !value) {
      console.log(gpid,value, req.body)
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid payload",
      });
    }

    // Update options
    const updateOptions = {
      $set: {
        priority: value,
      },
    };
    // Update documents
    const updatePromises = [
      ProviderModel.findOneAndUpdate({ provider_id: gpid, ...query }, updateOptions),
      OtherGameModel.updateMany({ game_id: gpid }, updateOptions),
    ];
    await Promise.all(updatePromises);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Priority updated successfully",
    });
  } catch (error) {
    console.error("Error updating documents:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
};

const UpdateProviderImage = async (req, res) => {
  try {
    const { image_url } = req.body;
    const {modelQuery} = req.query;
    const {id}=req.params;
    const query = { ...modelQuery,_id:id };
    console.log(query)
    // console.log(query, "diysknkkk", image_url)
    if (!id || !image_url) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid payload",
      });
    }
    let provider = await ProviderModel.findOneAndUpdate(
      query,
      { image_url: image_url },
      { new: true }
    );
    return res.status(200).json({
      status: 200,
      success: true,
      data: provider,
      message: "Image updated successfully",
    });
  } catch (error) {
    console.error("Error updating documents:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error?.message || "Internal server error.",
    });
  }
};

module.exports = {
  ToggleProvider,
  GetProvider,
  GetProviderName,
  UpdateProviderPriority,
  UpdateProviderImage,
};
