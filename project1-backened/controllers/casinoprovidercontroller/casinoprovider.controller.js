const CasinoProvider = require("../../models/casinoprovider.model");
const GameStructure = require("../../models/gamestructure.model");
const ToggleProvider = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await CasinoProvider.findById(id);
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
    const { search, status, page = 1, limit = 10, modelQuery = {}, category } = req.query;
    
    // Ensure modelQuery is an object
    const query = { ...modelQuery };
   // console.log(query, "query", req.query, "req.query")
    if (status) {
      query.status = status === 'true';
    }
    if(category){
      query.category = { $in: category };
    }
    if (search) {
      query.$or = [
        { gameName: { $regex: new RegExp(search, "i") } },
        { gpName: { $regex: new RegExp(search, "i") } },
      ];
    }

    // Pagination
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Perform the main query and count queries in parallel
    const [allProviders, totalCount, activeProviders, inactiveProviders] = await Promise.all([
      CasinoProvider.find(query)
        .sort({ priority: 1 })
        .skip(skip)
        .limit(pageSize)
        .select('-site_auth_key'),
      CasinoProvider.countDocuments(query),
      CasinoProvider.countDocuments({ status: true, ...modelQuery }),
      CasinoProvider.countDocuments({ status: false, ...modelQuery }),
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


const UpdateProviderPriority = async (req, res) => {
  try {
    const { value, gpid } = req.body;
    // Check for valid payload
    const modelQuery=req.query.modelQuery
    const query=modelQuery
    if (!gpid || !value) {
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
      CasinoProvider.findOneAndUpdate({ gpId: gpid,...query }, updateOptions),
      GameStructure.updateMany({ gameProviderId: gpid }, updateOptions),
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
    const { gpid, image_url } = req.body;
    const modelQuery=req.query.modelQuery
    const query={...modelQuery, gpId: gpid}
    // console.log(query, "diysknkkk", image_url)
    if (!gpid || !image_url) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid payload",
      });
    }
    let provider=await CasinoProvider.findOneAndUpdate(query, {image_url:image_url}, {new:true}).select("-site_auth_key");
    return res.status(200).json({
      status: 200,
      success: true,
      data:provider,
      message: "Image updated successfully",
    });
  } catch (error) {
    console.error("Error updating documents:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error?.message||"Internal server error.",
    });
  }
};


const UpdateProviderCategoryImage = async (req, res) => {
  try {
    const { gpid, category_image_url } = req.body;
    const modelQuery=req.query.modelQuery
    const query={...modelQuery, gpId: gpid}
    // console.log(query, "diysknkkk", image_url)
    if (!gpid || !category_image_url) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid payload",
      });
    }
    let provider=await CasinoProvider.findOneAndUpdate(query, {category_image_url:category_image_url}, {new:true}).select("-site_auth_key")
    return res.status(200).json({
      status: 200,
      success: true,
      data:provider,
      message: "Image updated successfully",
    });
  } catch (error) {
    console.error("Error updating documents:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error?.message||"Internal server error.",
    });
  }
};

const DeleteCategory = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  const modelQuery = req.query.modelQuery;
  let query ={ _id: id, ...modelQuery};
  try {
    const updatedProvider = await CasinoProvider.findOneAndUpdate(
      query,
      { $pull: { category: category } },
      { new: true }
    ).select("-site_auth_key");
    res.status(200).json({
      status: 200,
      success: true,
      message: "Category deleted successfully",
      provider: updatedProvider,
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
    const provider = await CasinoProvider.findById(id).select("-site_auth_key");

    if (!provider) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Provider not found",
      });
    }

    if (provider.category.includes(category)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Category already exists in the game",
      });
    }

    const updatedProvider = await CasinoProvider.findOneAndUpdate(
      query,
      { $addToSet: { category: category } },
      { new: true }
    ).select("-site_auth_key");
    res.status(200).json({
      status: 200,
      success: true,
      message: "Category added successfully",
      provider: updatedProvider,
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


module.exports = { ToggleProvider, GetProvider, UpdateProviderPriority, UpdateProviderImage, UpdateProviderCategoryImage, AddCategory, DeleteCategory };
