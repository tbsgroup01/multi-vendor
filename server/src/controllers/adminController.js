const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { sequelize } = require("../config/db");
const { SubscriptionPlan, VendorSubscription, Vendor, User, Category, SubCategory, Order, OrderItem, Product } = require("../models");

// Helper: Seed default core plans into MySQL if none exist
const seedDefaultPlansIfNeeded = async () => {
    try {
        const count = await SubscriptionPlan.count();
        if (count === 0) {
            await SubscriptionPlan.bulkCreate([
                {
                    tierKey: "starter",
                    name: "Starter Merchant",
                    badge: "Basic Tier",
                    description: "Ideal for new local shops, home businesses and boutique startups.",
                    price: 999.00,
                    monthlyPrice: 999.00,
                    annualPrice: 9590.00,
                    popular: false,
                    colorTheme: "slate",
                    productLimit: 50,
                    durationInDays: 30,
                    isActive: true,
                    features: [
                        "Up to 50 active product listings",
                        "Standard merchant storefront profile",
                        "Weekly scheduled bank payouts",
                        "Basic order & sales analytics",
                        "Standard email support (24-48h)"
                    ]
                },
                {
                    tierKey: "growth",
                    name: "Growth Pro",
                    badge: "Most Popular • Best Value",
                    description: "Designed for established sellers scaling catalog, orders & revenue.",
                    price: 2499.00,
                    monthlyPrice: 2499.00,
                    annualPrice: 23990.00,
                    popular: true,
                    colorTheme: "emerald",
                    productLimit: 500,
                    durationInDays: 30,
                    isActive: true,
                    features: [
                        "Up to 500 active product listings",
                        "'Verified Merchant' trust badge",
                        "24-Hour express settlement payouts",
                        "Priority 24/7 in-app chat & ticket support"
                    ]
                },
                {
                    tierKey: "enterprise",
                    name: "Enterprise Platinum",
                    badge: "Unlimited • VIP Partner",
                    description: "Built for top brands, large distributors & high-volume mega merchants.",
                    price: 5999.00,
                    monthlyPrice: 5999.00,
                    annualPrice: 57590.00,
                    popular: false,
                    colorTheme: "amber",
                    productLimit: 999999,
                    durationInDays: 30,
                    isActive: true,
                    features: [
                        "Unlimited product listings & variants",
                        "'Brand Partner' exclusive golden badge",
                        "Instant same-day (24h) bank transfers",
                        "Priority 24/7 in-app chat & ticket support"
                    ]
                }
            ]);
            console.log("[DB Seed] Successfully initialized 3 Core Subscription Plans in MySQL.");
        }
    } catch (seedErr) {
        console.error("Warning: Failed to seed default plans:", seedErr.message);
    }
};

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
        await seedDefaultPlansIfNeeded();

        const { isActive } = req.query;
        const whereClause = {};

        if (isActive !== undefined) {
            whereClause.isActive = isActive === "true";
        }

        const plans = await SubscriptionPlan.findAll({
            where: whereClause,
            order: [["price", "ASC"]]
        });

        // Fetch subscriptions & vendors to compute real-time counts & stats
        const subscriptions = await VendorSubscription.findAll({
            include: [
                { model: SubscriptionPlan, as: "plan" },
                {
                    model: Vendor,
                    as: "vendor",
                    include: [{ model: User, as: "user", attributes: ["name", "email", "phone"] }]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        const vendors = await Vendor.findAll();

        const plansWithCounts = plans.map(p => {
            const planObj = p.toJSON();
            const activeSubsCount = subscriptions.filter(s => s.planId === p.id && s.status === "active").length;
            const vendorTierCount = vendors.filter(v => v.plan && p.tierKey && v.plan.toLowerCase() === p.tierKey.toLowerCase()).length;
            
            planObj.activeVendorsCount = Math.max(activeSubsCount, vendorTierCount);
            planObj.monthlyPrice = Number(planObj.monthlyPrice || planObj.price || 0);
            planObj.annualPrice = Number(planObj.annualPrice || Math.round(planObj.monthlyPrice * 10) || 0);
            return planObj;
        });

        const totalSubscribers = plansWithCounts.reduce((acc, p) => acc + (p.activeVendorsCount || 0), 0);
        const mrrTotal = plansWithCounts.reduce((acc, p) => acc + ((p.activeVendorsCount || 0) * (p.monthlyPrice || 0)), 0);
        const mrrInLakh = Number((mrrTotal / 100000).toFixed(2));

        const growthPlan = plansWithCounts.find(p => p.tierKey === "growth");
        const growthPlanShare = totalSubscribers > 0
            ? Math.round(((growthPlan?.activeVendorsCount || 0) / totalSubscribers) * 100)
            : 0;

        const totalCompleted = subscriptions.filter(s => s.paymentStatus === "completed").length;
        const totalActive = subscriptions.filter(s => s.status === "active").length;
        const retentionRate = totalCompleted > 0
            ? `${Math.min(100, Math.round((totalActive / totalCompleted) * 100))}%`
            : "96.4%";

        res.status(200).json({
            count: plansWithCounts.length,
            plans: plansWithCounts,
            stats: {
                totalSubscribers,
                mrrValue: mrrInLakh,
                growthPlanShare,
                retentionRate
            },
            subscribers: subscriptions.map(s => ({
                id: s.id,
                invoiceNumber: s.invoiceNumber,
                transactionId: s.transactionId,
                vendorName: s.vendor?.storeName || s.vendor?.businessName || "Vendor",
                vendorEmail: s.vendor?.user?.email || "N/A",
                planName: s.plan?.name || "Standard Plan",
                pricePaid: s.pricePaid,
                status: s.status,
                paymentStatus: s.paymentStatus,
                startDate: s.startDate,
                endDate: s.endDate,
                createdAt: s.createdAt
            }))
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
            monthlyPrice,
            annualPrice,
            description,
            price,
            productLimit,
            durationInDays,
            features,
            popular,
            badge,
            colorTheme,
            isActive
        } = req.body;

        const plan = await SubscriptionPlan.findByPk(id);
        if (!plan) {
            return res.status(404).json({ message: "Subscription plan not found" });
        }

        if (name !== undefined) plan.name = name.trim();
        if (description !== undefined) plan.description = description ? description.trim() : null;
        if (monthlyPrice !== undefined) {
            plan.monthlyPrice = Number(monthlyPrice);
            plan.price = Number(monthlyPrice);
        } else if (price !== undefined) {
            plan.price = Number(price);
            plan.monthlyPrice = Number(price);
        }
        if (annualPrice !== undefined) plan.annualPrice = Number(annualPrice);
        if (productLimit !== undefined) plan.productLimit = Number(productLimit);
        if (durationInDays !== undefined) plan.durationInDays = Number(durationInDays);
        if (features !== undefined) plan.features = Array.isArray(features) ? features : [];
        if (popular !== undefined) plan.popular = Boolean(popular);
        if (badge !== undefined) plan.badge = badge;
        if (colorTheme !== undefined) plan.colorTheme = colorTheme;
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
        const { name, description, image, slug, status } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const autoSlug = slug
            ? slug.trim().toLowerCase().replace(/\s+/g, "-")
            : name.trim().toLowerCase().replace(/\s+/g, "-");

        let imagePath = image || "";
        if (req.file) {
            imagePath = `/uploads/categories/${req.file.filename}`;
        }

        const category = await Category.create({
            name: name.trim(),
            slug: autoSlug,
            description: description || null,
            image: imagePath,
            status: status || "Active"
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
            order: [["id", "ASC"]]
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

        const { name, description, image, slug, status } = req.body;
        if (name !== undefined) category.name = name.trim();
        if (slug !== undefined) category.slug = slug.trim().toLowerCase().replace(/\s+/g, "-");
        if (description !== undefined) category.description = description;
        if (req.file) {
            category.image = `/uploads/categories/${req.file.filename}`;
        } else if (image !== undefined) {
            category.image = image;
        }
        if (status !== undefined) category.status = status;

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

// 16. Get All Product Purchase Payments & Transactions (Admin oversight)
const getAllProductPayments = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                },
                {
                    model: OrderItem,
                    as: "items",
                    include: [
                        { model: Vendor, as: "vendor", attributes: ["id", "storeName"] }
                    ]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        const formatted = orders.map((order) => {
            const rawAmount = Number(order.totalAmount || 0);
            const rawSubTotal = Number(order.subTotal || 0);
            const rawTax = Number(order.taxAmount || 0);
            const rawShipping = Number(order.shippingAmount || 0);

            // Determine method label
            let methodLabel = "Cash on Delivery";
            const m = (order.paymentMethod || "").toLowerCase();
            if (m === "razorpay" || order.razorpayPaymentId || order.razorpayOrderId) {
                methodLabel = "Razorpay (Online)";
            } else if (m === "card") {
                methodLabel = "Credit/Debit Card";
            } else if (m === "upi") {
                methodLabel = "UPI Direct";
            } else if (m === "netbanking") {
                methodLabel = "Net Banking";
            }

            // Products summary
            const products = (order.items || []).map((item) => ({
                id: item.id,
                name: item.productName || "Product",
                qty: item.quantity || 1,
                price: item.productPrice ? `₹${Number(item.productPrice).toLocaleString("en-IN")}` : "₹0",
                total: item.totalPrice ? `₹${Number(item.totalPrice).toLocaleString("en-IN")}` : "₹0",
                vendorName: item.vendor ? item.vendor.storeName : "Multi Store",
                image: item.productImage || null,
                status: item.status || "pending"
            }));

            // Format date
            const dateObj = new Date(order.createdAt);
            const isToday = new Date().toDateString() === dateObj.toDateString();
            const timeStr = dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
            const dateStr = isToday
                ? `Today, ${timeStr}`
                : `${dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}, ${timeStr}`;

            // Parse shippingAddress if stored as string
            let parsedAddress = order.shippingAddress;
            if (typeof parsedAddress === "string") {
                try {
                    parsedAddress = JSON.parse(parsedAddress);
                } catch (e) {}
            }

            return {
                id: order.orderNumber || `ORD-${order.id}`,
                dbId: order.id,
                orderNumber: order.orderNumber,
                customerName: order.user ? order.user.name : (parsedAddress?.fullName || "Guest Customer"),
                customerEmail: order.user ? order.user.email : "N/A",
                customerPhone: order.user ? order.user.phone : (parsedAddress?.phone || "N/A"),
                shippingAddress: parsedAddress,
                grossAmount: `₹${rawAmount.toLocaleString("en-IN")}`,
                grossRaw: rawAmount,
                subTotal: `₹${rawSubTotal.toLocaleString("en-IN")}`,
                taxAmount: `₹${rawTax.toLocaleString("en-IN")}`,
                shippingAmount: `₹${rawShipping.toLocaleString("en-IN")}`,
                method: methodLabel,
                paymentStatus: (order.paymentStatus || "pending").toLowerCase(),
                orderStatus: order.orderStatus || "placed",
                razorpayOrderId: order.razorpayOrderId || null,
                razorpayPaymentId: order.razorpayPaymentId || null,
                transactionId: order.razorpayPaymentId || order.razorpayOrderId || (methodLabel === "Cash on Delivery" ? "COD - Pay at Doorstep" : "N/A"),
                date: dateStr,
                createdAt: order.createdAt,
                products
            };
        });

        res.status(200).json({
            count: formatted.length,
            payments: formatted
        });
    } catch (error) {
        console.error("Error fetching product payments:", error);
        res.status(500).json({
            message: "Failed to fetch payments",
            error: error.message
        });
    }
};

// 17. Delete an Order / Payment record (Admin only)
const deletePaymentOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({
            where: {
                [sequelize.Sequelize.Op.or]: [
                    { id: isNaN(Number(id)) ? 0 : Number(id) },
                    { orderNumber: String(id) }
                ]
            }
        });

        if (!order) {
            return res.status(404).json({ message: "Order payment record not found" });
        }

        await order.destroy();
        res.status(200).json({ message: "Order payment record deleted successfully" });
    } catch (error) {
        console.error("Error deleting order payment:", error);
        res.status(500).json({
            message: "Failed to delete order payment",
            error: error.message
        });
    }
};

// 18. Get Admin Profile from DB
const getAdminProfile = async (req, res) => {
    try {
        let adminUser = null;
        if (req.user && req.user.id) {
            adminUser = await User.findByPk(req.user.id, {
                attributes: ["id", "name", "email", "phone", "role", "avatar", "createdAt"]
            });
        }
        
        // Fallback: look for the user with admin role
        if (!adminUser) {
            adminUser = await User.findOne({
                where: { role: "admin" },
                attributes: ["id", "name", "email", "phone", "role", "avatar", "createdAt"]
            });
        }

        if (!adminUser) {
            return res.status(404).json({ message: "Admin profile not found in database" });
        }

        res.status(200).json({
            success: true,
            user: {
                id: adminUser.id,
                fullName: adminUser.name,
                name: adminUser.name,
                email: adminUser.email,
                phone: adminUser.phone,
                role: adminUser.role || "admin",
                designation: "Super Administrator",
                avatar: adminUser.avatar || null,
                createdAt: adminUser.createdAt
            }
        });
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin profile",
            error: error.message
        });
    }
};

// 19. Update Admin Profile in DB
const updateAdminProfile = async (req, res) => {
    try {
        let adminUser = null;
        if (req.user && req.user.id) {
            adminUser = await User.findByPk(req.user.id);
        }
        if (!adminUser) {
            adminUser = await User.findOne({ where: { role: "admin" } });
        }

        if (!adminUser) {
            return res.status(404).json({ message: "Admin user not found in database" });
        }

        const { fullName, name, email, phone, newPassword, avatar: avatarPayload } = req.body;
        const displayName = (fullName || name || "").trim();

        if (displayName) {
            adminUser.name = displayName;
        }

        if (email && email.trim() && email.trim().toLowerCase() !== adminUser.email.toLowerCase()) {
            const cleanEmail = email.trim().toLowerCase();
            const existingEmail = await User.findOne({
                where: {
                    email: cleanEmail,
                    id: { [Op.ne]: adminUser.id }
                }
            });
            if (existingEmail) {
                return res.status(400).json({ message: "Email is already taken by another user" });
            }
            adminUser.email = cleanEmail;
        }

        if (phone && phone.trim() && phone.trim() !== adminUser.phone) {
            const cleanPhone = phone.trim();
            const existingPhone = await User.findOne({
                where: {
                    phone: cleanPhone,
                    id: { [Op.ne]: adminUser.id }
                }
            });
            if (existingPhone) {
                return res.status(400).json({ message: "Phone number is already taken by another user" });
            }
            adminUser.phone = cleanPhone;
        }

        // Handle uploaded file or base64/url avatar
        if (req.file) {
            adminUser.avatar = `/uploads/avatars/${req.file.filename}`;
        } else if (avatarPayload !== undefined && avatarPayload !== null) {
            adminUser.avatar = avatarPayload;
        }

        // Handle password update
        if (newPassword && newPassword.trim()) {
            if (newPassword.trim().length < 6) {
                return res.status(400).json({ message: "New password must be at least 6 characters long" });
            }
            const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
            adminUser.password = hashedPassword;
        }

        await adminUser.save();

        const userData = {
            id: adminUser.id,
            fullName: adminUser.name,
            name: adminUser.name,
            email: adminUser.email,
            phone: adminUser.phone,
            role: adminUser.role || "admin",
            designation: "Super Administrator",
            avatar: adminUser.avatar
        };

        res.status(200).json({
            success: true,
            message: "Admin profile details updated successfully in database!",
            user: userData
        });
    } catch (error) {
        console.error("Error updating admin profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update admin profile",
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
    deleteCustomer,
    getAllProductPayments,
    deletePaymentOrder,
    getAdminProfile,
    updateAdminProfile
};
