const createRole = require("../controller/role/create.role");
const deleteSelectedRole = require("../controller/role/delete-role");
const rolesList = require("../controller/role/get-active-role");
const getRoleById = require("../controller/role/get-role-by-id");
const getRoleList = require("../controller/role/get-role-list");
const updateRole = require("../controller/role/update.role");

const roleRoutes = require("express").Router();

//!--------------Role Routes---------------------
roleRoutes.post("/create-role", createRole);
roleRoutes.post("/get-role-list", getRoleList);
roleRoutes.post("/get-role-by-id", getRoleById);
roleRoutes.post("/update-role", updateRole);
roleRoutes.post("/delete-role", deleteSelectedRole);
roleRoutes.get("/get-active-role", rolesList)


module.exports = roleRoutes;
