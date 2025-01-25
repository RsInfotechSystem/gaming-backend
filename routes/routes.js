const blockRoutes = require("./block.routes");
const brandRoutes = require("./brand.routes");
const categoryRoutes = require("./category.routes");
const locationRoutes = require("./location.routes");
const notificationRoutes = require("./notification.routes");
const nrRoutes = require("./nr.routes");
const reportRoutes = require("./report.routes");
const roleRoutes = require("./role.routes");
const stockRoute = require("./stock.routes");
const userRoutes = require("./user.routes");

const routes = require("express").Router();

//!------------Main Routes-------------------
routes.use("/role", roleRoutes);
routes.use("/location", locationRoutes);
routes.use("/user", userRoutes);
routes.use("/category", categoryRoutes);
routes.use("/block", blockRoutes);
routes.use("/brand", brandRoutes);
routes.use("/inventory", stockRoute);
routes.use("/report", reportRoutes);
routes.use("/nr", nrRoutes);
routes.use("/notification", notificationRoutes)

module.exports = routes;