const express = require("express");
const router = express.Router();

const {
    createProduct,
    getMyProducts,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const { protect, restrictTo, isApprovedVendor } = require("../middlewares/authMiddleware");

// Vendor-specific routes (Must be placed before /:id)
router.post("/", protect, restrictTo("vendor"), isApprovedVendor, createProduct);
router.get("/my-products", protect, restrictTo("vendor"), isApprovedVendor, getMyProducts);

// Public browsing routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Update & Delete routes (Vendor owner or Admin)
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
