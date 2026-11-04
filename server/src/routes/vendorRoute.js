const express = require("express");
const router = express.Router();

const {
    getAllVendors,
    getVendorById,
    approveVendor,
    rejectVendor,
    updateVendorStatus,
    deleteVendor
} = require("../controllers/vendorController");

const { protect, restrictTo } = require("../middlewares/authMiddleware");


router.use(protect);

router.get("/:id", getVendorById);

// Admin-only routes
router.get("/", restrictTo("admin"), getAllVendors);
router.put("/:id/approve", restrictTo("admin"), approveVendor);
router.put("/:id/reject", restrictTo("admin"), rejectVendor);
router.put("/:id/status", restrictTo("admin"), updateVendorStatus);
router.delete("/:id", restrictTo("admin"), deleteVendor);

module.exports = router;
