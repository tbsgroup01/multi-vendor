const express = require("express");
const router = express.Router();

const {
    getAllVendors,
    getVendorById,
    approveVendor,
    rejectVendor,
    updateVendorStatus
} = require("../controllers/vendorController");

const { protect, restrictTo } = require("../middlewares/authMiddleware");

// All routes here require authentication
router.use(protect);

// View single vendor by ID (Vendor themselves or Admin)
router.get("/:id", getVendorById);

// Admin-only routes
router.get("/", restrictTo("admin"), getAllVendors);
router.put("/:id/approve", restrictTo("admin"), approveVendor);
router.put("/:id/reject", restrictTo("admin"), rejectVendor);
router.put("/:id/status", restrictTo("admin"), updateVendorStatus);

module.exports = router;
