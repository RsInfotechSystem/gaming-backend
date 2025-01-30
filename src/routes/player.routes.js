
const authenticateUserJWT = require("../utils/middleware/auth");
const createPlayer = require("../controller/player/create-player");
const updatePlayer = require("../controller/player/update-player");
const loginPlayer = require("../controller/player/login-player");
const getPlayerById = require("../controller/player/get-player-by-id");
const getPlayerList = require("../controller/player/get-player-list");  
const forgetPassword = require("../controller/player/forget-password");
const changePassword = require("../controller/player/change-password");
const resetPassword= require("../controller/player/reset-password");
const deletePlayerById = require("../controller/player/delete-player");
const deletePlayerPermanently = require("../controller/player/permanently-delete-player");
const changePlayerStatus = require("../controller/player/change-player-status");

const playerRoutes = require('express').Router();   

playerRoutes.post("/create-player",createPlayer);
playerRoutes.post("/update-player",updatePlayer);
playerRoutes.post("/login-player",loginPlayer);
playerRoutes.post("/get-player-by-id",getPlayerById);
playerRoutes.post("/get-player-list",getPlayerList);
playerRoutes.post("/forget-password",forgetPassword);    
playerRoutes.post("/change-password",changePassword);
playerRoutes.post("/reset-password",resetPassword);
playerRoutes.post("/delete-player",deletePlayerById);
playerRoutes.post("/delete-player-permanently",deletePlayerPermanently);
playerRoutes.post("/change-player-status",changePlayerStatus);


module.exports = playerRoutes; 