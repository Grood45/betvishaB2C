const express = require("express");
const { GetSinglePermission } = require("../controllers/permissioncontroller/permission.controller");
const PermissionRouter = express.Router();

PermissionRouter.get('/get-single-permission',GetSinglePermission)


module.exports={PermissionRouter}