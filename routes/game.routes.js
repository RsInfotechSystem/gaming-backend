const authenticateUserJWT = require("../utils/middleware/auth");
const tabAccessMiddleware = require("../utils/middleware/tab-access-middleware");
const createGame = require("../controller/game/create-game");
const updateGame = require("../controller/game/update-game");
// const deleteSelectedGame = require("../controller/game/delete-game");
// const gamesList = require("../controller/game/get-active-game");
// const getGameById = require("../controller/game/get-game-by-id");
// const getGameList = require("../controller/game/get-game-list");

const gameRoutes = require("express").Router();

//!--------------game Routes---------------------
gameRoutes.post("/create-game", authenticateUserJWT, tabAccessMiddleware("game list"), createGame);
gameRoutes.post("/update-game", updateGame);
// gameRoutes.post("/get-game-list", getGameList);
// gameRoutes.post("/get-game-by-id", getGameById);
// gameRoutes.post("/delete-game", deleteSelectedGame);
// gameRoutes.get("/get-active-game", gamesList)


module.exports = gameRoutes;
