const changeStockStatus = require("../controller/inventory/change-stock-status");
const deleteSelectedStock = require("../controller/inventory/delete-stock");
const getMaterialForApproval = require("../controller/inventory/get-material-for-approval");
const getMaterialForInventory = require("../controller/inventory/get-material-for-inventory");
const getStockById = require("../controller/inventory/get-stock-by-id");
const getStockList = require("../controller/inventory/get-stock-list");
const sellMaterial = require("../controller/inventory/sell-material");
const stockIn = require("../controller/inventory/stock-in");
const updateStockIn = require("../controller/inventory/update-stock-entry");
const authenticateUserJWT = require("../utils/middleware/auth");
const tabAccessMiddleware = require("../utils/middleware/tab-access-middleware");

const stockRoute = require("express").Router();


stockRoute.post("/stock-in", authenticateUserJWT, tabAccessMiddleware("Stock In"), stockIn);
stockRoute.post("/get-stock-list", authenticateUserJWT, tabAccessMiddleware("Stock In"), getStockList);
stockRoute.post("/get-stock-by-id", authenticateUserJWT, getStockById);
stockRoute.post("/change-stock-status", authenticateUserJWT, tabAccessMiddleware("Stock In"), changeStockStatus);
stockRoute.post("/update-stock", authenticateUserJWT, tabAccessMiddleware("Stock In"), updateStockIn);
stockRoute.post("/delete-stock", authenticateUserJWT, tabAccessMiddleware("Stock In"), deleteSelectedStock);
stockRoute.post("/get-material-for-inventory", authenticateUserJWT, getMaterialForInventory);
stockRoute.post("/stock-out-material", authenticateUserJWT, sellMaterial);
stockRoute.post("/get-material-for-approval", authenticateUserJWT, tabAccessMiddleware("Approval"), getMaterialForApproval);



module.exports = stockRoute;