const { sequelize } = require("../config/db");
const { SubscriptionPlan, VendorSubscription, Vendor, User, Category, SubCategory, Order, OrderItem, Product } = require("../models");

// 1. Create a new Subscription Plan (Admin only)
const createPlan = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            productLimit,
            durationInDays,
            features,
            isActive
        } = req.body;

        // Validation
        if (!name || price === undefined || !productLimit || !durationInDays) {
            return res.status(400).json({
                message: "Plan name, price, productLimit, and durationInDays are required"
            });
        }

        if (Number(price) < 0) {
            return res.status(400).json({ message: "Price cannot be negative" });
        }

        if (Number(productLimit) <= 0) {
            return res.status(400).json({ message: "Product limit must be greater than 0" });
        }

        if (Number(durationInDays) <= 0) {
            return res.status(400).json({ message: "Duration in days must be greater than 0" });
        }

        const plan = await SubscriptionPlan.create({
            name: name.trim(),
            description: description ? description.trim() : null,
            price: Number(price),
            productLimit: Number(productLimit),
            durationInDays: Number(durationInDays),
            features: Array.isArray(features) ? features : [],
            isActive: isActive !== undefined ? Boolean(isActive) : true
        });

        res.status(201).json({
            message: "Subscription plan created successfully",
            plan
        });
    } catch (error) {
        console.error("Error creating subscription plan:", error);
        res.status(500).json({
            message: "Failed to create subscription plan",
            error: error.message
        });
    }
};

// 2. Get all Subscription Plans (Admin view)
const getAllPlans = async (req, res) => {
    try {
        const { isActive } = req.query;
        const whereClause = {};

        if (isActive !== undefined) {
            whereClause.isActive = isActive === "true";
        }

        const plans = await SubscriptionPlan.findAll({
            where: whereClause,
            order: [["price", "ASC"]]
        });

        res.status(200).json({
            count: plans.length,
            plans
        });
    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        res.status(500).json({
            message: "Failed to fetch subscription plans",
            error: error.message
        });
    }
};

// 3. Get single Plan by ID
const getPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await SubscriptionPlan.findByPk(id);

        if (!plan) {
            return res.status(404).json({ message: "Subscription plan not found" });
        }

        res.status(200).json({ plan });
    } catch (error) {
        console.error("Error fetching subscription plan:", error);
        res.status(500).json({
            message: "Failed to fetch subscription plan",
            error: error.message
        });
    }
};

// 4. Update Subscription Plan (Admin only)
const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            price,
            productLimit,
            durationInDays,
            features,
            isActive
        } = req.body;

        const plan = await SubscriptionPlan.findByPk(id);
        if (!plan) {
            return res.status(404).json({ message: "Subscription plan not found" });
        }

        if (name !== undefined) plan.name = name.trim();
        if (description !== undefined) plan.description = description ? description.trim() : null;
        if (price !== undefined) plan.price = Number(price);
        if (productLimit !== undefined) plan.productLimit = Number(productLimit);
        if (durationInDays !== undefined) plan.durationInDays = Number(durationInDays);
        if (features !== undefined) plan.features = Array.isArray(features) ? features : [];
        if (isActive !== undefined) plan.isActive = Boolean(isActive);

        await plan.save();

        res.status(200).json({
            message: "Subscription plan updated successfully",
            plan
        });
    } catch (error) {
        console.error("Error updating subscription plan:", error);
        res.status(500).json({
            message: "Failed to update subscription plan",
            error: error.message
        });
    }
};

// 5. Delete or Deactivate Subscription Plan
const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await SubscriptionPlan.findByPk(id);

        if (!plan) {
            return res.status(404).json({ message: "Subscription plan not found" });
        }

        // Soft delete by deactivating plan
        plan.isActive = false;
        await plan.save();

        res.status(200).json({
            message: "Subscription plan deactivated successfully",
            plan
        });
    } catch (error) {
        console.error("Error deleting subscription plan:", error);
        res.status(500).json({
            message: "Failed to delete subscription plan",
            error: error.message
        });
    }
};

// 6. View all Vendor Subscriptions (Admin view)
const getAllVendorSubscriptions = async (req, res) => {
    try {
        const { status } = req.query;
        const whereClause = {};

        if (status) {
            whereClause.status = status.toLowerCase();
        }

        const subscriptions = await VendorSubscription.findAll({
            where: whereClause,
            include: [
                {
                    model: Vendor,
                    as: "vendor",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "email", "phone"]
                        }
                    ]
                },
                {
                    model: SubscriptionPlan,


                    as: "plan"
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            count: subscriptions.length,
            subscriptions
        });
    } catch (error) {
        console.error("Error fetching vendor subscriptions:", error);
        res.status(500).json({
            message: "Failed to fetch vendor subscriptions",
            error: error.message
        });
    }
};


const assignPlanToVendor = async (req, res) => {
    try {
        const { vendorId, planId, paymentMethod } = req.body;

        if (!vendorId || !planId) {
            return res.status(400).json({ message: "vendorId and planId are required" });
        }

        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const plan = await SubscriptionPlan.findByPk(planId);
        if (!plan) {
            return res.status(404).json({ message: "Subscription plan not found" });
        }


        await VendorSubscription.update(
            { status: "expired" },
            { where: { vendorId: vendor.id, status: "active" } }
        );

        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000);
        const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Date.now().toString().slice(-6)}-V${vendor.id}`;
        const transactionId = `ADMIN_ASSIGN_${Date.now()}`;

        const subscription = await VendorSubscription.create({
            vendorId: vendor.id,
            planId: plan.id,
            invoiceNumber,
            transactionId,
            startDate,
            endDate,
            pricePaid: plan.price,
            productLimit: plan.productLimit,
            status: "active",
            paymentStatus: "completed",
            paymentMethod: paymentMethod || "admin_manual"
        });

        res.status(201).json({
            message: "Subscription assigned to vendor successfully",
            subscription
        });
    } catch (error) {
        console.error("Error assigning subscription to vendor:", error);
        res.status(500).json({
            message: "Failed to assign subscription to vendor",
            error: error.message
        });
    }
};

const createCategories = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name) {
            return res.status(400).json({ message: "name is required" });
        }

        const category = await Category.create({
            name: name.trim(),
            description: description || null,
            image: image || ""
        });

        res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({
            message: "Failed to create category",
            error: error.message
        });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: [
                {
                    model: SubCategory,
                    as: "subCategories",
                    attributes: ["id", "name", "image", "description", "isActive"]
                }
            ],
            order: [["name", "ASC"]]
        });
        res.status(200).json({
            count: categories.length,
            categories
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [
                {
                    model: SubCategory,
                    as: "subCategories",
                    attributes: ["id", "name", "image", "description", "isActive"]
                }
            ]
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ category });
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({
            message: "Failed to fetch category",
            error: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const { name, description, image } = req.body;
        if (name !== undefined) category.name = name.trim();
        if (description !== undefined) category.description = description;
        if (image !== undefined) category.image = image;

        await category.save();

        res.status(200).json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({
            message: "Failed to update category",
            error: error.message
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.destroy();

        res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({
            message: "Failed to delete category",
            error: error.message
        });
    }
};

const dropDatabase = async (req, res) => {
    try {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

        const [tables] = await sequelize.query("SHOW TABLES;");
        const droppedTables = [];

        for (const tableObj of tables) {
            const tableName = Object.values(tableObj)[0];
            if (tableName) {
                await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
                droppedTables.push(tableName);
            }
        }

        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");

        await sequelize.sync();

        res.status(200).json({
            message: "Database tables dropped and fresh schema recreated successfully.",
            droppedTables,
            tablesRecreated: Object.keys(sequelize.models)
        });
    } catch (error) {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;").catch(() => { });
        console.error("Error dropping database:", error);
        res.status(500).json({
            message: "Failed to drop database",
            error: error.message
        });
    }
};


// Customer Oversight: Get All Customers with their orders & purchased items
const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.findAll({
            where: { role: "user" },
            attributes: ["id", "name", "email", "phone", "role", "isVerified", "createdAt"],
            include: [
                {
                    model: Order,
                    as: "orders",
                    required: false,
                    attributes: ["id", "orderNumber", "totalAmount", "orderStatus", "createdAt", "shippingAddress"],
                    include: [
                        {
                            model: OrderItem,
                            as: "items",
                            required: false,
                            attributes: ["id", "productName", "productPrice", "quantity", "totalPrice", "vendorId", "productId"],
                            include: [
                                {
                                    model: Product,
                                    as: "product",
                                    required: false,
                                    attributes: ["id", "name"]
                                },
                                {
                                    model: Vendor,
                                    as: "vendor",
                                    required: false,
                                    attributes: ["id", "storeName", "businessName"]
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        const formatted = customers.map((c) => {
            const userOrders = c.orders || [];
            const ordersCount = userOrders.length;
            const spentRaw = userOrders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);

            const purchases = [];
            userOrders.forEach((o) => {
                (o.items || []).forEach((it) => {
                    const prodName = it.product?.name || it.productName || "Product Item";
                    const vendorName = it.vendor?.storeName || it.vendor?.businessName || "Registered Store";
                    purchases.push({
                        product: prodName,
                        vendor: vendorName,
                        qty: it.quantity || 1,
                        price: `₹${parseFloat(it.productPrice || it.totalPrice || 0).toLocaleString("en-IN")}`
                    });
                });
            });

            let addressStr = "Marketplace Registered Buyer";
            if (userOrders.length > 0 && userOrders[0].shippingAddress) {
                const addr = userOrders[0].shippingAddress;
                if (typeof addr === "object") {
                    addressStr = [addr.address, addr.area, addr.city, addr.pincode].filter(Boolean).join(", ");
                } else if (typeof addr === "string") {
                    addressStr = addr;
                }
            }

            return {
                id: c.id,
                name: c.name,
                email: c.email,
                phone: c.phone || "N/A",
                ordersCount,
                spentRaw,
                totalSpent: `₹${spentRaw.toLocaleString("en-IN")}`,
                address: addressStr,
                purchases,
                createdAt: c.createdAt,
                joinedDate: new Date(c.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                })
            };
        });

        res.status(200).json({
            count: formatted.length,
            customers: formatted
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({
            message: "Failed to fetch customers",
            error: error.message
        });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await User.findOne({
            where: { id, role: "user" },
            attributes: ["id", "name", "email", "phone", "role", "isVerified", "createdAt"]
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ customer });
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({
            message: "Failed to fetch customer",
            error: error.message
        });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await User.findOne({ where: { id, role: "user" } });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        await customer.destroy();
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({
            message: "Failed to delete customer",
            error: error.message
        });
    }
};

module.exports = {
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
};
