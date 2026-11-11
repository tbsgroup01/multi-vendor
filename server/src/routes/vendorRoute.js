const express = require("express");
const router = express.Router();

const {
    getMyVendorDashboard,
    getMyVendorNotifications,
    getMyVendorSettings,
    updateMyVendorSettings,
    getAllVendors,
    getVendorById,
    approveVendor,
    rejectVendor,
    updateVendorStatus,
    deleteVendor
} = require("../controllers/vendorController");

const { protect, restrictTo, isApprovedVendor } = require("../middlewares/authMiddleware");


router.use(protect);

router.get("/me/dashboard", restrictTo("vendor"), isApprovedVendor, getMyVendorDashboard);
router.get("/me/notifications", restrictTo("vendor"), isApprovedVendor, getMyVendorNotifications);
router.get("/me/settings", restrictTo("vendor"), isApprovedVendor, getMyVendorSettings);
router.put("/me/settings", restrictTo("vendor"), isApprovedVendor, updateMyVendorSettings);
router.get("/:id", getVendorById);

// Admin-only routes
router.get("/", restrictTo("admin"), getAllVendors);
router.put("/:id/approve", restrictTo("admin"), approveVendor);
router.put("/:id/reject", restrictTo("admin"), rejectVendor);
router.put("/:id/status", restrictTo("admin"), updateVendorStatus);
router.delete("/:id", restrictTo("admin"), deleteVendor);

module.exports = router;
