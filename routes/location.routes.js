const changeLocationStatus = require("../controller/location/change-location-status");
const createLocation = require("../controller/location/create-location");
const getActiveLocations = require("../controller/location/get-active-location");
const getLocationById = require("../controller/location/get-location-by-id");
const getLocationList = require("../controller/location/get-location-list");
const updateLocation = require("../controller/location/update-location");

const locationRoutes = require("express").Router();

//!--------------------Location Routes------------------
locationRoutes.post("/create-location", createLocation);
locationRoutes.post("/get-location-list", getLocationList);
locationRoutes.post("/get-location-by-id", getLocationById);
locationRoutes.post("/update-location", updateLocation);
locationRoutes.post("/change-location-status", changeLocationStatus);
locationRoutes.get("/get-active-location", getActiveLocations);



module.exports = locationRoutes;