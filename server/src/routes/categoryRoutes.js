const express = require("express");
const router = express.Router();
const { getAllCategories, getCategoryById } = require("../controllers/adminController");
const { getSubCategoriesByCategoryId } = require("../controllers/subCategoryController");

// Public routes to browse categories and their subcategories
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/:categoryId/subcategories", getSubCategoriesByCategoryId);

module.exports = router;
