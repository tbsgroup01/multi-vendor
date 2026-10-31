const express = require("express");
const router = express.Router();
const {
    getMyOrders,
    getOrderById,
    getVendorOrders,
    updateOrderItemStatus
} = require("../controllers/orderController");
const { protect, restrictTo, isApprovedVendor } = require("../middlewares/authMiddleware");

// All order routes require authentication
router.use(protect);

// 1. Customer: View order history
router.get("/my-orders", getMyOrders);

// 2. Vendor: View orders placed for items from their store
router.get("/vendor/my-orders", restrictTo("vendor"), isApprovedVendor, getVendorOrders);

// 3. Customer / Admin: View specific order details
router.get("/:id", getOrderById);

// 4. Vendor / Admin: Update fulfillment status of an individual order item
router.put("/items/:id/status", restrictTo("vendor", "admin"), updateOrderItemStatus);

module.exports = router;
