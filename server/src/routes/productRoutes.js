const express = require("express");
const router = express.Router();

const {
    uploadProductImages,
    createProduct,
    getMyProducts,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const { protect, restrictTo, isApprovedVendor } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Upload endpoints for images (Can upload multiple product or variant images at once)
router.post("/upload", protect, restrictTo("vendor", "admin"), upload.array("images", 10), uploadProductImages);
router.post("/upload/variant", protect, restrictTo("vendor", "admin"), upload.array("variantImages", 10), uploadProductImages);

// Vendor-specific routes (Must be placed before /:id)
router.post("/", protect, restrictTo("vendor", "admin"), isApprovedVendor, upload.any(), createProduct);
router.get("/my-products", protect, restrictTo("vendor", "admin"), isApprovedVendor, getMyProducts);

// Public browsing routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Update & Delete routes (Vendor owner or Admin)
router.put("/:id", protect, upload.any(), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
