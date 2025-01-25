const getNonReplacableStockList = require("../controller/inventory/get-non-replacable-stock-list");
const sellNonReplacableStock = require("../controller/inventory/sell-nr-material");
const authenticateUserJWT = require("../utils/middleware/auth");
const checkUserStatusMiddleware = require("../utils/middleware/check-user-status");
const tabAccessMiddleware = require("../utils/middleware/tab-access-middleware");

const nrRoutes = require("express").Router();

nrRoutes.post("/get-non-replacable-stock-list", getNonReplacableStockList);
nrRoutes.post("/sell-non-replacable-stock", authenticateUserJWT, checkUserStatusMiddleware, tabAccessMiddleware("NR Material"), sellNonReplacableStock);


module.exports = nrRoutes;