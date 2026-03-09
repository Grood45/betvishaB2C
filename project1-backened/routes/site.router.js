const express = require("express");
const {
  GetAllRecords,
  UpdateRecord,
  ToggleIsActive,
  ToggleSelected,
  AddRecord,
} = require("../controllers/sitecontroller.js/site.controller");
const SiteRouter = express.Router();

// Route to get all records
SiteRouter.get("/get-all-site-record", GetAllRecords);

// Route to update a record
SiteRouter.patch("/update-site-record/:id", UpdateRecord);

// Route to toggle 'is_active' field
SiteRouter.patch("/toggle-is-active/:id", ToggleIsActive);

// Route to toggle 'selected' field
SiteRouter.patch("/toggle-selected/:id", ToggleSelected);

// Route to add a new record
SiteRouter.post("/add-site-record", AddRecord);

module.exports = SiteRouter;
