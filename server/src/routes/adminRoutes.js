const express = require("express");
const router = express.Router();

const {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan,
    getAllVendorSubscriptions,
    assignPlanToVendor,
    createCategories,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    dropDatabase,
    getAllCustomers,
    getCustomerById,
    deleteCustomer,
    getAllProductPayments,
    deletePaymentOrder,
    getAdminProfile,
    updateAdminProfile,
    getDashboardStats
} = require("../controllers/adminController");

const {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
} = require("../controllers/subCategoryController");

const { protect, restrictTo } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Testing utility route: Drop entire database and recreate fresh schema (Temporary for testing)
router.all("/dropexist", dropDatabase);

// All admin routes require authentication and admin role
router.use(protect, restrictTo("admin"));

// Admin Dashboard stats & metrics
router.get("/dashboard-stats", getDashboardStats);

// Admin Profile management
router.get("/profile", getAdminProfile);
router.put("/profile", upload.single("avatar"), updateAdminProfile);

// Subscription Plan management
router.post("/plans", createPlan);
router.get("/plans", getAllPlans);
router.get("/plans/:id", getPlanById);
router.put("/plans/:id", updatePlan);
router.delete("/plans/:id", deletePlan);

// Vendor Subscriptions oversight
router.get("/subscriptions", getAllVendorSubscriptions);
router.post("/subscriptions/assign", assignPlanToVendor);

// Categories management
router.post("/categories", upload.single("image"), createCategories);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.put("/categories/:id", upload.single("image"), updateCategory);
router.delete("/categories/:id", deleteCategory);

// SubCategories management
router.post("/subcategories", upload.single("image"), createSubCategory);
router.get("/subcategories", getAllSubCategories);
router.get("/subcategories/:id", getSubCategoryById);
router.put("/subcategories/:id", upload.single("image"), updateSubCategory);
router.delete("/subcategories/:id", deleteSubCategory);

// Customer management oversight
router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomerById);
router.delete("/customers/:id", deleteCustomer);

// Product Purchase Payments & Transactions oversight
router.get("/payments", getAllProductPayments);
router.delete("/payments/:id", deletePaymentOrder);

module.exports = router;
