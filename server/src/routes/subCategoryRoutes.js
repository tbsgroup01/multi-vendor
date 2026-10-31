const express = require("express");
const router = express.Router();

const {
    createSubCategory,
    getAllSubCategories,
    getSubCategoriesByCategoryId,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
} = require("../controllers/subCategoryController");

const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Public browsing routes
router.get("/", getAllSubCategories);
router.get("/category/:categoryId", getSubCategoriesByCategoryId);
router.get("/:id", getSubCategoryById);

// Admin-only management routes
router.post("/", protect, restrictTo("admin"), createSubCategory);
router.put("/:id", protect, restrictTo("admin"), updateSubCategory);
router.delete("/:id", protect, restrictTo("admin"), deleteSubCategory);

module.exports = router;
