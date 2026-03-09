const SeoModel = require("../../models/seo.model");
// Controller to get all documents
const GetAllDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    // Apply pagination
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
    };
    const modelQuery = req.query.modelQuery;
    const skip = (options.page - 1) * options.limit;

    // Fetch data from the database based on the pagination options
    const documents = await SeoModel.find(modelQuery)
      .skip(skip)
      .limit(options.limit);
    // Count total items for pagination
    const totalItems = await SeoModel.countDocuments(modelQuery);
    const totalPages = Math.ceil(totalItems / options.limit);
    // Construct pagination object
    const pagination = {
      totalItems,
      totalPages,
      currentPage: options.page,
      limit: options.limit,
    };

    return res.status(200).json({
      status: 200,
      data: documents,
      success: true,
      pagination,
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message:error.message || "An error occurred."
    });
  }
};

// Controller to get a single document by _id
const GetSingleDocumentById = async (req, res) => {
  try {
    const name=req.params.name
    const modelQuery = req.query.modelQuery;
    const document = await SeoModel.findOne({name:name,modelQuery});
    if (!document) {
      return res.send({
        status: 404,
        success: false,
        message: "Document not found.",
      });
    }
    res.send({
      status: 200,
      success: true,
      data: document,
      message: "Document retrieved successfully.",
    });
  } catch (error) {
    res.status(500).send({
        status: 500,
        success: false,
        message: error.message || "An error occurred.",
  })
  }
};

// Controller to update a document by _id
const UpdateDocumentById = async (req, res) => {
  try {
    const id=req.params.id
    const modelQuery = req.query.modelQuery;
    let query={...modelQuery, _id:id}
    const updatedDocument = await SeoModel.findOneAndUpdate(
      query,
      req.body,
      { new: true }
    );
    if (!updatedDocument) {
      return res.send({
        status: 404,
        success: false,
        message: "Document not found.",
      });
    }
    res.send({
      status: 200,
      success: true,
      data: updatedDocument,
      message: "Document updated successfully.",
    });
  } catch (error) {
    res.status(500).send({
        status: 500,
        success: false,
        message: error.message || "An error occurred.",
  })
  }
};

// Controller to add a new document
const AddNewDocument = async (req, res) => {
  try {
    const modelQuery = req.query.modelQuery;
    const payload={...req.body, ...modelQuery}
    const newDocument = new SeoModel(payload);
    await newDocument.save();
    res.send({
      status: 201,
      success: true,
      data: newDocument,
      message: "Document added successfully.",
    });
  } catch (error) {
    res.status(500).send({
        status: 500,
        success: false,
        message: error.message || "An error occurred.",
  })
  }
};


const DeleteDocumentById = async (req, res) => {
  try {
    const id=req.params.id;
    const modelQuery = req.query.modelQuery;
    let query={...modelQuery, _id:id}
    const deletedDocument = await SeoModel.findOneAndDelete(query);
    if (!deletedDocument) {
      return res.status(404).send({
        status: 404,
        success: false,
        message: "Document not found.",
      });
    }
    res.status(200).send({
      status: 200,
      success: true,
      data: deletedDocument,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      message: error.message || "An error occurred.",
    });
  }
};

module.exports = {
  GetAllDocuments,
  GetSingleDocumentById,
  UpdateDocumentById,
  AddNewDocument,
  DeleteDocumentById
};
