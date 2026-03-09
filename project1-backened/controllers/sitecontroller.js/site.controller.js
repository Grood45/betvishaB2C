const SiteSwitch = require("../../models/siteswitch.model");
const GetAllRecords = async (req, res) => {
  try {
    console.log(req.query, "model query1")
    // Fetch data from the database based on the pagination options
    const documents = await SiteSwitch.find();
    console.log(documents, "document")
    // Count total items for pagination
    return res.status(200).json({
      status: 200,  
      data: documents,
      success: true,
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "An error occurred.",
    });
  }
};

const UpdateRecord = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedRecord = await SiteSwitch.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.json({
      status: 200,
      data: updatedRecord,
      success: true,
    });
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const ToggleIsActive = async (req, res) => {
  const { id } = req.params;
  try {
    const record = await SiteSwitch.findById(id);
    record.is_active = !record.is_active;
    await record.save();
    res.json({
      status: 200,
      data: record,
      success: true,
    });
  } catch (error) {
    console.error("Error toggling is_active:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const ToggleSelected = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the record being toggled
    const record = await SiteSwitch.findById(id).lean();

    // If the record is already selected, do nothing
    if (record.selected) {
      return res.status(200).json({
        status: 200,
        data: record,
        message: "Record already selected",
        success: true,
      });
    }

    // Deselect all other records
    await SiteSwitch.updateMany({ _id: { $ne: id } }, { selected: false });

    // Toggle the selected state of the current record
    const updatedRecord = await SiteSwitch.findByIdAndUpdate(id, { selected: true }, { new: true }).lean();

    return res.status(200).json({
      status: 200,
      data: updatedRecord,
      message: "Record successfully selected",
      success: true,
    });
  } catch (error) {
    console.error("Error toggling selected:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


const AddRecord = async (req, res) => {
  const newData = req.body;
  try {
    const newRecord = await SiteSwitch.create(newData);
    res.status(201).json({
      status: 201,
      data: newRecord,
      success: true,
    });
  } catch (error) {
    console.error("Error adding record:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  GetAllRecords,
  UpdateRecord,
  ToggleIsActive,
  ToggleSelected,
  AddRecord,
};
