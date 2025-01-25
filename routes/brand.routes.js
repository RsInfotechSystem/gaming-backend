const createBrand = require("../controller/brand/create-brand");
const deleteSelectedBrand = require("../controller/brand/delete-brand");
const brandList = require("../controller/brand/get-active-brand");
const getBrandList = require("../controller/brand/get-all-brand");
const getBrandById = require("../controller/brand/get-brand-by-id");
const getCategoryWiseBrand = require("../controller/brand/get-category-wise-brand");
const updateBrand = require("../controller/brand/update-brand");
const authenticateUserJWT = require("../utils/middleware/auth");
const checkUserStatusMiddleware = require("../utils/middleware/check-user-status");
const tabAccessMiddleware = require("../utils/middleware/tab-access-middleware");

const brandRoutes = require("express").Router();

brandRoutes.post("/create-brand", authenticateUserJWT, tabAccessMiddleware("brand"), createBrand);
brandRoutes.post("/delete-brand", authenticateUserJWT, tabAccessMiddleware("brand"), deleteSelectedBrand);
brandRoutes.post("/get-brand-by-id", authenticateUserJWT, getBrandById);
brandRoutes.post("/get-all-brand", authenticateUserJWT, checkUserStatusMiddleware, tabAccessMiddleware("brand"), getBrandList);
brandRoutes.post("/update-brand", authenticateUserJWT, tabAccessMiddleware("brand"), updateBrand);
brandRoutes.get("/get-active-brand", authenticateUserJWT, checkUserStatusMiddleware, brandList)
brandRoutes.post("/get-category-wise-brand", authenticateUserJWT, checkUserStatusMiddleware, tabAccessMiddleware('Model Details'), getCategoryWiseBrand)


module.exports = brandRoutes;