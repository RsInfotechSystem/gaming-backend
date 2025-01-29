const getBrandCount = require("../controller/report/get-brand-count");
const getCategoryCount = require("../controller/report/get-category-count");
const getLocationCount = require("../controller/report/get-location-count");
const getReportWiseMaterialList = require("../controller/report/get-report-wise-material-list");
const getStockByCategoryId = require("../controller/report/get-stock-by-category-id");
const stockOutGraphList = require("../controller/report/get-stock-out-graph-list");
const getStockStatusCount = require("../controller/report/get-stock-status-count");
const stockOutGraph = require("../controller/report/stock-out-graph");
const authenticateUserJWT = require("../utils/middleware/auth");
const checkUserStatusMiddleware = require("../utils/middleware/check-user-status");
const tabAccessMiddleware = require("../utils/middleware/tab-access-middleware");

const reportRoutes = require("express").Router();

reportRoutes.get("/get-brand-count", authenticateUserJWT, checkUserStatusMiddleware, tabAccessMiddleware('Report'), getBrandCount);
reportRoutes.get("/get-category-count", authenticateUserJWT, checkUserStatusMiddleware, tabAccessMiddleware("Report"), getCategoryCount)
reportRoutes.get("/get-location-count", authenticateUserJWT, checkUserStatusMiddleware, tabAccessMiddleware('Report'), getLocationCount);
reportRoutes.get("/get-stock-status-count", authenticateUserJWT, checkUserStatusMiddleware, tabAccessMiddleware('Report'), getStockStatusCount);
reportRoutes.post("/get-stock-by-category-id", authenticateUserJWT, checkUserStatusMiddleware, tabAccessMiddleware('Report'), getStockByCategoryId);
reportRoutes.post("/get-report-material-list", authenticateUserJWT, checkUserStatusMiddleware, tabAccessMiddleware('Report'), getReportWiseMaterialList);
reportRoutes.post("/get-stock-out-count", authenticateUserJWT, checkUserStatusMiddleware, tabAccessMiddleware('Report'), stockOutGraph);
reportRoutes.post("/get-stock-out-list", authenticateUserJWT, checkUserStatusMiddleware, tabAccessMiddleware('Report'), stockOutGraphList);


module.exports = reportRoutes;