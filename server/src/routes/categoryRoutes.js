const express = require("express");
const router = express.Router();
const { getAllCategories, getCategoryById } = require("../controllers/adminController");

// Public routes to browse categories
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

module.exports = router;
