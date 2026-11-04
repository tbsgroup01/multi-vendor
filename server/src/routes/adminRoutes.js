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
    deleteCustomer
} = require("../controllers/adminController");

const {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
} = require("../controllers/subCategoryController");

const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Testing utility route: Drop entire database and recreate fresh schema (Temporary for testing)
router.all("/dropexist", dropDatabase);

// All admin routes require authentication and admin role
router.use(protect, restrictTo("admin"));

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
router.post("/categories", createCategories);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// SubCategories management
router.post("/subcategories", createSubCategory);
router.get("/subcategories", getAllSubCategories);
router.get("/subcategories/:id", getSubCategoryById);
router.put("/subcategories/:id", updateSubCategory);
router.delete("/subcategories/:id", deleteSubCategory);

// Customer management oversight
router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomerById);
router.delete("/customers/:id", deleteCustomer);

module.exports = router;
