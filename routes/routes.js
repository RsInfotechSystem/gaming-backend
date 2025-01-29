const gameRoutes = require("./game.routes");
const locationRoutes = require("./location.routes");
const notificationRoutes = require("./notification.routes");
const reportRoutes = require("./report.routes");
const roleRoutes = require("./role.routes");
const userRoutes = require("./user.routes");

const routes = require("express").Router();

//!------------Main Routes-------------------
routes.use("/role", roleRoutes);
routes.use("/location", locationRoutes);
routes.use("/user", userRoutes);
routes.use("/game", gameRoutes);

// routes.use("/report", reportRoutes);
routes.use("/notification", notificationRoutes)

module.exports = routes;