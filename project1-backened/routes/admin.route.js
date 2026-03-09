const express = require("express");
const {
  GetAllUser,
  UserChangePassword,
  AdminChangePassword,
  AdminLogin,
  GetSingleAdmin,
  GetSingleUser,
  UpdateSingleAdmin,
  AdminSelfResetPassword,
  CreateAdminOrUser,
  DepositAmount,
  WithdrawAmount,
  DepositAmountUser,
  WithdrawAmountUser,
  ToggleUserStatus,
  ToggleAdminStatus,
  GetAllDepositDataOfLowerAdmin,
  GetAllWithdrawDataOfLowerAdmin,
  GetAllWithdrawDataOfSelf,
  GetAllDepositDataOfSelf,
  GetAllAdmin,
  DeleteSingleUser,
  DeleteSingleAdmin,
  CheckUsernameExistence,
  UpdateSingleUser,
  AdminChipCreate,
  GetAllUserByAdmin,
  GetAllAdminByAdmin,
  SendMailUser,
  GetAllUserByParent,
  GetAllAdminByParent,
  GetRecentOnlineUserCount,
  GetAllDeletedUser,
  RestoreSingleUser,
  PermanentDeleteSingleUser,
} = require("../controllers/admincontroller/admin.controller");
const { addShortcut, getShortcuts, updateShortcut, deleteShortcut } = require("../controllers/shortcutcontroller/shortcut.controller");
const CheckPermission = require("../middlewares/checkpermission.middleware");

const AdminRouter = express.Router();
AdminRouter.get("/get-all-user", GetAllUser);
AdminRouter.post("/create-admin-user", CreateAdminOrUser);
AdminRouter.post("/get-all-user-by-admin", GetAllUserByAdmin);
AdminRouter.post("/get-all-admin-by-admin", GetAllAdminByAdmin);
AdminRouter.patch("/toggle-user-status/:user_id", ToggleUserStatus);
AdminRouter.patch("/toggle-admin-status/:admin_id", ToggleAdminStatus);
AdminRouter.get("/get-all-admin", GetAllAdmin);

// AdminRouter.get("/get-admin-control/:control_id", GetAdminContro);
// AdminRouter.patch("/reset-password/:admin_id", AdminPasswordReset);
AdminRouter.patch("/admin-self-reset-password", AdminSelfResetPassword);
AdminRouter.patch("/user-reset-password", UserChangePassword);
AdminRouter.patch("/admin-reset-password", AdminChangePassword);
AdminRouter.post("/create-chip/:admin_id", AdminChipCreate);

// AdminRouter.post("/send-mail/:user_id", SendMailUser);
AdminRouter.post("/deposit-amount", DepositAmount);
AdminRouter.post("/withdraw-amount", WithdrawAmount);
AdminRouter.post("/deposit-amount-user", DepositAmountUser);
AdminRouter.post("/withdraw-amount-user", WithdrawAmountUser);
AdminRouter.get(
  "/get-all-deposit-data-of-lower-admin",
  GetAllDepositDataOfLowerAdmin
);
AdminRouter.get(
  "/get-all-withdraw-data-of-lower-admin",
  GetAllWithdrawDataOfLowerAdmin
);
AdminRouter.get("/get-all-deposit-data-of-self", GetAllDepositDataOfSelf);
AdminRouter.get("/get-all-withdraw-data-of-self", GetAllWithdrawDataOfSelf);
AdminRouter.post("/admin-login", AdminLogin);
AdminRouter.get("/get-single-admin/:admin_id", GetSingleAdmin);
AdminRouter.get("/get-single-user/:user_id", GetSingleUser);
AdminRouter.patch("/update-single-user/:user_id", UpdateSingleUser);
AdminRouter.patch("/update-single-admin/:admin_id", UpdateSingleAdmin);
AdminRouter.delete("/delete-admin/:admin_id", DeleteSingleAdmin);
AdminRouter.delete("/delete-user/:user_id", DeleteSingleUser);
AdminRouter.get("/get-all-deleted-user", GetAllDeletedUser);
AdminRouter.patch("/restore-user/:user_id", RestoreSingleUser);
AdminRouter.delete("/permanent-delete-user/:user_id", PermanentDeleteSingleUser);
AdminRouter.post("/exist-or-not/", CheckUsernameExistence);
AdminRouter.post("/send-mail/:user_id", SendMailUser);
AdminRouter.get("/get-all-user-by-parent", GetAllUserByParent);
AdminRouter.get("/get-all-admin-by-parent", GetAllAdminByParent);
AdminRouter.get("/get-recent-online-user-count", GetRecentOnlineUserCount);
// AdminRouter.get("/get-withdraw-amount/:user_id", GetTodayWithdrawAmount);

// AdminRouter.get("/get-all-user", CheckPermission("allUserView"), GetAllUser);
// AdminRouter.post("/create-admin-user", CheckPermission("allUserManage"), CreateAdminOrUser);
// AdminRouter.post("/get-all-user-by-admin", CheckPermission("allUserView"), GetAllUserByAdmin);
// AdminRouter.post("/get-all-admin-by-admin", CheckPermission("allAdminView"), GetAllAdminByAdmin);
// AdminRouter.patch("/toggle-user-status/:user_id", CheckPermission("userManage"), ToggleUserStatus);
// AdminRouter.patch("/toggle-admin-status/:admin_id", CheckPermission("adminManage"), ToggleAdminStatus);
// AdminRouter.get("/get-all-admin", CheckPermission("allAdminView"), GetAllAdmin);
// AdminRouter.patch("/admin-self-reset-password", CheckPermission("adminManage"), AdminSelfResetPassword);
// AdminRouter.patch("/user-reset-password", CheckPermission("userManage"), UserChangePassword);
// AdminRouter.patch("/admin-reset-password", CheckPermission("adminManage"), AdminChangePassword);
// AdminRouter.post("/create-chip/:admin_id", CheckPermission("generateAmountManage"), AdminChipCreate);
// AdminRouter.post("/deposit-amount", CheckPermission("downlineDepositView"), DepositAmount);
// AdminRouter.post("/withdraw-amount", CheckPermission("downlineWithdrawView"), WithdrawAmount);
// AdminRouter.post("/deposit-amount-user", CheckPermission("userDepositManage"), DepositAmountUser);
// AdminRouter.post("/withdraw-amount-user", CheckPermission("userWithdrawManage"), WithdrawAmountUser);
// AdminRouter.get("/get-all-deposit-data-of-lower-admin", CheckPermission("downlineDepositView"), GetAllDepositDataOfLowerAdmin);
// AdminRouter.get("/get-all-withdraw-data-of-lower-admin", CheckPermission("downlineWithdrawView"), GetAllWithdrawDataOfLowerAdmin);
// AdminRouter.get("/get-all-deposit-data-of-self", GetAllDepositDataOfSelf);
// AdminRouter.get("/get-all-withdraw-data-of-self", GetAllWithdrawDataOfSelf);
// AdminRouter.post("/admin-login", AdminLogin);
// AdminRouter.get("/get-single-admin/:admin_id", CheckPermission("adminView"), GetSingleAdmin);
// AdminRouter.get("/get-single-user/:user_id", CheckPermission("userView"), GetSingleUser);
// AdminRouter.patch("/update-single-user/:user_id", CheckPermission("userManage"), UpdateSingleUser);
// AdminRouter.patch("/update-single-admin/:admin_id", CheckPermission("adminManage"), UpdateSingleAdmin);
// AdminRouter.delete("/delete-admin/:admin_id", CheckPermission("adminManage"), DeleteSingleAdmin);
// AdminRouter.delete("/delete-user/:user_id", CheckPermission("userManage"), DeleteSingleUser);
// AdminRouter.post("/exist-or-not/", CheckUsernameExistence);
// AdminRouter.post("/send-mail/:user_id", CheckPermission("userManage"), SendMailUser);
// AdminRouter.get("/get-all-user-by-parent", CheckPermission("allUserView"), GetAllUserByParent);
// AdminRouter.get("/get-all-admin-by-parent", CheckPermission("downlineDepositView"), GetAllAdminByParent);






const { GetUserGraphData, GetUserJoinGraphData, GetUsersByJoinDate, GetLiveUsersByLocation } = require("../controllers/admincontroller/graph.controller");

AdminRouter.get("/get-user-graph-data", GetUserGraphData);
AdminRouter.get("/get-user-join-graph-data", GetUserJoinGraphData);
AdminRouter.get("/get-users-by-join-date", GetUsersByJoinDate);
AdminRouter.get("/get-live-users-by-location", GetLiveUsersByLocation);

// Shortcut Routes
AdminRouter.post("/create-shortcut", addShortcut);
AdminRouter.get("/get-shortcuts", getShortcuts);
AdminRouter.put("/update-shortcut/:id", updateShortcut);
AdminRouter.delete("/delete-shortcut/:id", deleteShortcut);

module.exports = { AdminRouter };
