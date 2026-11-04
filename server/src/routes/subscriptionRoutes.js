const express = require("express");
const router = express.Router();

const {
    getPublicPlans,
    getPlanDetails,
    previewPurchase,
    purchasePlan,
    getMySubscription,
    getSubscriptionHistory,
    getInvoiceDetails,
    getAdminOverview,
    updateAdminPlan,
    createAdminPlan,
    deleteAdminPlan
} = require("../controllers/subscriptionController");

const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Public routes: Browse plans
router.get("/plans", getPublicPlans);
router.get("/plans/:id", getPlanDetails);

// Admin-only overview and plan management
router.get("/admin/overview", protect, restrictTo("admin"), getAdminOverview);
router.post("/admin/plans", protect, restrictTo("admin"), createAdminPlan);
router.put("/admin/plans/:id", protect, restrictTo("admin"), updateAdminPlan);
router.delete("/admin/plans/:id", protect, restrictTo("admin"), deleteAdminPlan);

// Vendor-only routes: Checkout, Purchase, and Subscription Management
router.post("/preview", protect, restrictTo("vendor"), previewPurchase);
router.post("/purchase", protect, restrictTo("vendor"), purchasePlan);
router.get("/my-subscription", protect, restrictTo("vendor"), getMySubscription);
router.get("/history", protect, restrictTo("vendor"), getSubscriptionHistory);
router.get("/invoice/:id", protect, getInvoiceDetails);

module.exports = router;
