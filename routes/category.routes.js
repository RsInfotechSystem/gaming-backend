const createCategory = require("../controller/category/create-category");
const deleteSelectedCategory = require("../controller/category/delete-category");
const categoryList = require("../controller/category/get-active-category-list");
const getCategoryById = require("../controller/category/get-category-by-id");
const getCategoryList = require("../controller/category/get-category-list");
const updateCategory = require("../controller/category/update-category");


const categoryRoutes = require("express").Router();

//!----------------------Category Routes-------------------
categoryRoutes.post("/create-category", createCategory);
categoryRoutes.post("/get-category-list", getCategoryList);
categoryRoutes.post("/get-category-by-id", getCategoryById);
categoryRoutes.post("/update-category", updateCategory);
categoryRoutes.post("/delete-category", deleteSelectedCategory);
categoryRoutes.get("/get-active-category", categoryList)


module.exports = categoryRoutes;