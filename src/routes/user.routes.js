const changeUserStatus = require("../controller/user/change-user-status");
const createUser = require("../controller/user/create.user");
const deleteSelectedUser = require("../controller/user/delete-user");
const getLocationWiseUser = require("../controller/user/get-location-wise-user");
const getUserById = require("../controller/user/get-user-by-id");
const getUserList = require("../controller/user/get-user-list");
const login = require("../controller/user/login");
const updateUser = require("../controller/user/update-user");
const authenticateUserJWT = require("../utils/middleware/auth");
const tabAccessMiddleware = require("../utils/middleware/tab-access-middleware");
const changePassword = require("../controller/user/change-password");
const forgetPassword = require("../controller/user/forget-password");
const changePasswordForm = require("../controller/user/change-password-form");
const resetUserPassword = require("../controller/user/reset-user-password");

const userRoutes = require("express").Router();

//!--------------User Routes----------------
userRoutes.post("/login", login);
userRoutes.post("/create-user", authenticateUserJWT, tabAccessMiddleware("user management"), createUser);
userRoutes.post("/get-user-list", authenticateUserJWT, tabAccessMiddleware("user management"), getUserList);
userRoutes.post("/get-user-by-id", authenticateUserJWT, tabAccessMiddleware("user management"), getUserById);
userRoutes.post("/update-user", authenticateUserJWT, tabAccessMiddleware("user management"), updateUser);
userRoutes.post("/change-user-status", authenticateUserJWT, tabAccessMiddleware("user management"), changeUserStatus)
userRoutes.post("/delete-user", authenticateUserJWT, tabAccessMiddleware("user management"), deleteSelectedUser)
userRoutes.post("/change-password", authenticateUserJWT, changePassword);
userRoutes.post("/forget-password", forgetPassword);
userRoutes.get("/change-password-form", changePasswordForm);
userRoutes.post("/reset-user-password", resetUserPassword);

// userRoutes.post("/get-location-wise-users", authenticateUserJWT, getLocationWiseUser);



module.exports = userRoutes;