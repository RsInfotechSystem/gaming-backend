const gameRoutes = require("./game.routes");
const locationRoutes = require("./location.routes");
const notificationRoutes = require("./notification.routes");
const contestRoutes = require("./contest.routes");
const roleRoutes = require("./role.routes");
const userRoutes = require("./user.routes");
const playerRoutes = require("./player.routes");
const coinRoutes = require("./coin.routes");
const walletRoutes = require("./wallet.routes");

const routes = require("express").Router();

//!------------Main Routes-------------------
routes.use("/role", roleRoutes);
routes.use("/user", userRoutes);
routes.use("/game", gameRoutes);
routes.use("/player", playerRoutes);
routes.use("/coin", coinRoutes);
routes.use("/contest", contestRoutes);
routes.use("/wallet", walletRoutes);
// routes.use("/notification", notificationRoutes)

module.exports = routes;