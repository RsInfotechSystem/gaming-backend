const authenticateUserJWT = require("../utils/middleware/auth");
const authenticatePlayerJWT = require("../utils/middleware/auth-player")
const tabAccessMiddleware = require("../utils/middleware/tab-access-middleware");
const createCoin = require("../controller/coin/create-coin");
const updateCoin = require("../controller/coin/update-coin");
const getCoinList = require("../controller/coin/get-coin-list");
const deleteCoin = require("../controller/coin/delete-coin");
const getCoinById = require("../controller/coin/get-coin-by-id");
const getCoinListForUser = require("../controller/coin/get-coin-list-for-user");
const purchaseCoins = require("../controller/coin/purchase-coins");
const getPlayerAvailableCoins = require("../controller/coin/get-player-available-coins");
// const gamesList = require("../controller/coin/get-active-coin");

const coinRoutes = require("express").Router();

//!--------------coin Routes---------------------
coinRoutes.post("/create-coin", authenticateUserJWT, tabAccessMiddleware("coins"), createCoin);
coinRoutes.post("/update-coin", authenticateUserJWT, tabAccessMiddleware("coins"), updateCoin);
coinRoutes.post("/get-coin-list", getCoinList);
coinRoutes.post("/get-coin-by-id", authenticateUserJWT, tabAccessMiddleware("coins"), getCoinById);
coinRoutes.post("/delete-coin", authenticateUserJWT, tabAccessMiddleware("coins"), deleteCoin);
coinRoutes.post("/get-coin-list-for-user", getCoinListForUser);
coinRoutes.post("/purchase-coins", authenticatePlayerJWT, purchaseCoins);
coinRoutes.get("/get-player-coins", authenticatePlayerJWT, getPlayerAvailableCoins);


module.exports = coinRoutes;
