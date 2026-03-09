const express = require("express");
const {
  GetSetting,
  UpdateSetting,
} = require("../controllers/settingcontroller/setting.controller");


const SettingRouter = express.Router();
SettingRouter.get("/get-setting/:id", GetSetting);
SettingRouter.patch("/update-setting/:id", UpdateSetting);

module.exports = { SettingRouter };
