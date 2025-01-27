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

const userRoutes = require("express").Router();

//!--------------User Routes----------------
userRoutes.post("/login", login);
userRoutes.post("/create-user", authenticateUserJWT, tabAccessMiddleware("User Management"), createUser);
userRoutes.post("/get-user-list",  getUserList);
userRoutes.post("/get-user-by-id", getUserById);
userRoutes.post("/update-user", authenticateUserJWT, tabAccessMiddleware("User Management"), updateUser);
userRoutes.post("/change-user-status", authenticateUserJWT, tabAccessMiddleware("User Management"), changeUserStatus)
userRoutes.post("/delete-user", authenticateUserJWT, tabAccessMiddleware("User Management"), deleteSelectedUser)
userRoutes.post("/get-location-wise-users", authenticateUserJWT, getLocationWiseUser);



module.exports = userRoutes;