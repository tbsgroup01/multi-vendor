const { SubscriptionPlan, VendorSubscription, Vendor, User } = require("../models");
const transporter = require("../config/mail");

// Helper: Generate unique invoice number
const generateInvoiceNumber = (vendorId) => {
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${timestamp}-V${vendorId}`;
};

// Helper: Generate unique transaction ID
const generateTransactionId = () => {
    return `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
};

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

// 1. Get all active plans (Public / Vendor)
const getPublicPlans = async (req, res) => {
    try {
        await seedDefaultPlansIfNeeded();

        const plans = await SubscriptionPlan.findAll({
            where: { isActive: true },
            order: [["price", "ASC"]]
        });

        res.status(200).json({
            count: plans.length,
            plans
        });
    } catch (error) {
        console.error("Error fetching public plans:", error);
        res.status(500).json({
            message: "Failed to fetch plans",
            error: error.message
        });
    }
};

// 2. Get specific plan details (Public / Vendor)
const getPlanDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await SubscriptionPlan.findOne({
            where: { id, isActive: true }
        });

        if (!plan) {
            return res.status(404).json({ message: "Subscription plan not found" });
        }

        res.status(200).json({ plan });
    } catch (error) {
        console.error("Error fetching plan details:", error);
        res.status(500).json({
            message: "Failed to fetch plan details",
            error: error.message
        });
    }
};

// 3. Checkout Preview (Calculates totals, GST, dates before purchase)
const previewPurchase = async (req, res) => {
    try {
        const { planId } = req.body;

        if (!planId) {
            return res.status(400).json({ message: "planId is required" });
        }

        const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }

        if (vendor.status !== "approved") {
            return res.status(403).json({
                message: "Your vendor account is not approved yet. Only approved vendors can purchase plans."
            });
        }

        const plan = await SubscriptionPlan.findOne({ where: { id: planId, isActive: true } });
        if (!plan) {
            return res.status(404).json({ message: "Subscription plan not found or is inactive" });
        }

        // Check if vendor already has an active subscription
        const currentActive = await VendorSubscription.findOne({
            where: { vendorId: vendor.id, status: "active" },
            include: [{ model: SubscriptionPlan, as: "plan" }]
        });

        let isRenewal = false;
        let startDate = new Date();
        let endDate;

        if (currentActive && currentActive.planId === plan.id && new Date(currentActive.endDate) > new Date()) {
            // Renewal of same plan: extend from current end date
            isRenewal = true;
            startDate = new Date(currentActive.endDate);
            endDate = new Date(startDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000);
        } else {
            // New purchase or upgrade: starts now
            endDate = new Date(startDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000);
        }

        const basePrice = Number(plan.price);
        const gstRate = 0.18; // 18% GST standard in India
        const gstAmount = Number((basePrice * gstRate).toFixed(2));
        const totalAmount = Number((basePrice + gstAmount).toFixed(2));

        res.status(200).json({
            plan: {
                id: plan.id,
                name: plan.name,
                durationInDays: plan.durationInDays,
                productLimit: plan.productLimit
            },
            billing: {
                basePrice,
                gstRate: "18%",
                gstAmount,
                totalAmount
            },
            validity: {
                isRenewal,
                startDate,
                endDate,
                durationInDays: plan.durationInDays
            },
            currentActivePlan: currentActive ? currentActive.plan.name : null
        });

    } catch (error) {
        console.error("Error previewing purchase:", error);
        res.status(500).json({
            message: "Failed to generate checkout preview",
            error: error.message
        });
    }
};

// 4. Proper Plan Purchase Execution
const purchasePlan = async (req, res) => {
    try {
        const { planId, paymentMethod, transactionRef } = req.body;

        if (!planId) {
            return res.status(400).json({ message: "planId is required" });
        }

        const vendor = await Vendor.findOne({
            where: { userId: req.user.id },
            include: [{ model: User, as: "user", attributes: ["name", "email", "phone"] }]
        });

        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }

        if (vendor.status !== "approved") {
            return res.status(403).json({
                message: "Your vendor account is not approved yet. Only approved vendors can purchase plans."
            });
        }

        const plan = await SubscriptionPlan.findOne({ where: { id: planId, isActive: true } });
        if (!plan) {
            return res.status(404).json({ message: "Subscription plan not found or is inactive" });
        }

        // Check current active subscription
        const currentActive = await VendorSubscription.findOne({
            where: { vendorId: vendor.id, status: "active" }
        });

        let startDate = new Date();
        let endDate;
        let isRenewal = false;

        if (currentActive && currentActive.planId === plan.id && new Date(currentActive.endDate) > new Date()) {
            // Renewal of the same plan: extend current active subscription
            isRenewal = true;
            startDate = new Date(currentActive.endDate);
            endDate = new Date(startDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000);
            
            // Mark previous active record as renewed
            currentActive.status = "expired";
            await currentActive.save();
        } else {
            // New plan or upgrade: expire old ones
            if (currentActive) {
                currentActive.status = "expired";
                await currentActive.save();
            }
            endDate = new Date(startDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000);
        }

        const invoiceNumber = generateInvoiceNumber(vendor.id);
        const transactionId = transactionRef || generateTransactionId();

        // Create the active vendor subscription
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
            paymentMethod: paymentMethod || "card"
        });

        // Send Email Confirmation with full invoice details
        if (vendor.user && vendor.user.email) {
            try {
                const formattedStartDate = startDate.toLocaleDateString();
                const formattedEndDate = endDate.toLocaleDateString();

                await transporter.sendMail({
                    from: `"MultiVendor App" <${process.env.EMAIL_USER}>`,
                    to: vendor.user.email,
                    subject: `Subscription Confirmed: ${plan.name} (${invoiceNumber})`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                            <h2 style="color: #2563eb;">Plan Purchase Successful! 🎉</h2>
                            <p>Hello <strong>${vendor.user.name}</strong>,</p>
                            <p>Thank you for subscribing to the <strong>${plan.name}</strong> on MultiVendor Marketplace.</p>
                            
                            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                                <tr style="background: #f8fafc;"><td style="padding: 8px; border: 1px solid #cbd5e1;">Invoice Number</td><td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>${invoiceNumber}</strong></td></tr>
                                <tr><td style="padding: 8px; border: 1px solid #cbd5e1;">Transaction ID</td><td style="padding: 8px; border: 1px solid #cbd5e1;">${transactionId}</td></tr>
                                <tr style="background: #f8fafc;"><td style="padding: 8px; border: 1px solid #cbd5e1;">Store Name</td><td style="padding: 8px; border: 1px solid #cbd5e1;">${vendor.storeName}</td></tr>
                                <tr><td style="padding: 8px; border: 1px solid #cbd5e1;">Plan Name</td><td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>${plan.name}</strong></td></tr>
                                <tr style="background: #f8fafc;"><td style="padding: 8px; border: 1px solid #cbd5e1;">Product Listing Quota</td><td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>${plan.productLimit} Products</strong></td></tr>
                                <tr><td style="padding: 8px; border: 1px solid #cbd5e1;">Price Paid</td><td style="padding: 8px; border: 1px solid #cbd5e1;">₹${plan.price}</td></tr>
                                <tr style="background: #f8fafc;"><td style="padding: 8px; border: 1px solid #cbd5e1;">Payment Method</td><td style="padding: 8px; border: 1px solid #cbd5e1;">${paymentMethod || "card"}</td></tr>
                                <tr><td style="padding: 8px; border: 1px solid #cbd5e1;">Valid From</td><td style="padding: 8px; border: 1px solid #cbd5e1;">${formattedStartDate}</td></tr>
                                <tr style="background: #f8fafc;"><td style="padding: 8px; border: 1px solid #cbd5e1;">Valid Until</td><td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>${formattedEndDate}</strong></td></tr>
                            </table>

                            <p style="color: #475569;">You can now list up to <strong>${plan.productLimit} products</strong> in your store until <strong>${formattedEndDate}</strong>.</p>
                            <br/>
                            <p style="color: #64748b; font-size: 12px;">MultiVendor Marketplace Team</p>
                        </div>
                    `
                });
            } catch (mailError) {
                console.error("Warning: Failed to send purchase confirmation email:", mailError.message);
            }
        }

        res.status(201).json({
            message: isRenewal
                ? `Subscription successfully renewed for '${plan.name}'!`
                : `Successfully subscribed to '${plan.name}'!`,
            invoice: {
                invoiceNumber,
                transactionId,
                planName: plan.name,
                pricePaid: plan.price,
                productLimit: plan.productLimit,
                startDate,
                endDate,
                paymentStatus: "completed"
            },
            subscription
        });

    } catch (error) {
        console.error("Error purchasing plan:", error);
        res.status(500).json({
            message: "Failed to process plan purchase",
            error: error.message
        });
    }
};

// 5. Vendor gets their current active subscription with days remaining
const getMySubscription = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }

        const activeSubscription = await VendorSubscription.findOne({
            where: { vendorId: vendor.id, status: "active" },
            include: [{ model: SubscriptionPlan, as: "plan" }]
        });

        if (!activeSubscription) {
            return res.status(200).json({
                hasActiveSubscription: false,
                message: "No active subscription found. Please subscribe to a plan to start listing products."
            });
        }

        // Auto-check if subscription has expired
        const now = new Date();
        const expiryDate = new Date(activeSubscription.endDate);

        if (now > expiryDate) {
            activeSubscription.status = "expired";
            await activeSubscription.save();
            return res.status(200).json({
                hasActiveSubscription: false,
                message: "Your subscription has expired. Please renew your plan."
            });
        }

        // Calculate days remaining
        const remainingDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

        res.status(200).json({
            hasActiveSubscription: true,
            remainingDays,
            subscription: activeSubscription
        });
    } catch (error) {
        console.error("Error fetching my subscription:", error);
        res.status(500).json({
            message: "Failed to fetch subscription details",
            error: error.message
        });
    }
};

// 6. Vendor Subscription Purchase History
const getSubscriptionHistory = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }

        const history = await VendorSubscription.findAll({
            where: { vendorId: vendor.id },
            include: [{ model: SubscriptionPlan, as: "plan" }],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            count: history.length,
            history
        });
    } catch (error) {
        console.error("Error fetching subscription history:", error);
        res.status(500).json({
            message: "Failed to fetch subscription history",
            error: error.message
        });
    }
};

// 7. Get specific invoice receipt by subscription ID
const getInvoiceDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const subscription = await VendorSubscription.findByPk(id, {
            include: [
                { model: SubscriptionPlan, as: "plan" },
                {
                    model: Vendor,
                    as: "vendor",
                    include: [{ model: User, as: "user", attributes: ["name", "email", "phone"] }]
                }
            ]
        });

        if (!subscription) {
            return res.status(404).json({ message: "Invoice record not found" });
        }

        // Verify ownership (unless admin)
        if (req.user.role !== "admin" && subscription.vendorId !== vendor.id) {
            return res.status(403).json({ message: "Access denied: Not your invoice" });
        }

        res.status(200).json({
            invoiceNumber: subscription.invoiceNumber,
            transactionId: subscription.transactionId,
            date: subscription.createdAt,
            vendor: {
                storeName: subscription.vendor.storeName,
                businessName: subscription.vendor.businessName,
                gstNumber: subscription.vendor.gstNumber,
                ownerName: subscription.vendor.user?.name,
                ownerEmail: subscription.vendor.user?.email
            },
            plan: {
                name: subscription.plan.name,
                productLimit: subscription.productLimit,
                durationInDays: subscription.plan.durationInDays,
                validFrom: subscription.startDate,
                validUntil: subscription.endDate
            },
            billing: {
                amountPaid: subscription.pricePaid,
                paymentStatus: subscription.paymentStatus,
                paymentMethod: subscription.paymentMethod
            }
        });
    } catch (error) {
        console.error("Error fetching invoice:", error);
        res.status(500).json({
            message: "Failed to fetch invoice",
            error: error.message
        });
    }
};

// ================= ADMIN ENDPOINTS ================= //

// Admin 1: Get all plans and subscription metrics overview
const getAdminOverview = async (req, res) => {
    try {
        await seedDefaultPlansIfNeeded();

        const plans = await SubscriptionPlan.findAll({
            order: [["price", "ASC"]]
        });

        // Fetch all vendor subscriptions
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

        // Fetch vendors to account for current assigned tiers
        const vendors = await Vendor.findAll({
            include: [{ model: User, as: "user", attributes: ["name", "email"] }]
        });

        // Compute active count per plan
        const plansWithCounts = plans.map(p => {
            const planObj = p.toJSON();
            // Count from active subscriptions
            const activeSubsCount = subscriptions.filter(s => s.planId === p.id && s.status === "active").length;
            // Also count from vendors directly assigned to this plan tier
            const vendorTierCount = vendors.filter(v => v.plan && p.tierKey && v.plan.toLowerCase() === p.tierKey.toLowerCase()).length;
            
            planObj.activeVendorsCount = Math.max(activeSubsCount, vendorTierCount);
            planObj.monthlyPrice = Number(planObj.monthlyPrice || planObj.price || 0);
            planObj.annualPrice = Number(planObj.annualPrice || Math.round(planObj.monthlyPrice * 10) || 0);
            return planObj;
        });

        // Metrics calculations
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
            success: true,
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
        console.error("Error in getAdminOverview:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch subscription admin overview",
            error: error.message
        });
    }
};

// Admin 2: Update a plan
const updateAdminPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            monthlyPrice,
            annualPrice,
            description,
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
            return res.status(404).json({ success: false, message: "Subscription plan not found" });
        }

        if (name !== undefined) plan.name = name;
        if (monthlyPrice !== undefined) {
            plan.monthlyPrice = Number(monthlyPrice);
            plan.price = Number(monthlyPrice); // sync base price
        }
        if (annualPrice !== undefined) plan.annualPrice = Number(annualPrice);
        if (description !== undefined) plan.description = description;
        if (productLimit !== undefined) plan.productLimit = Number(productLimit);
        if (durationInDays !== undefined) plan.durationInDays = Number(durationInDays);
        if (features !== undefined) plan.features = features;
        if (popular !== undefined) plan.popular = Boolean(popular);
        if (badge !== undefined) plan.badge = badge;
        if (colorTheme !== undefined) plan.colorTheme = colorTheme;
        if (isActive !== undefined) plan.isActive = Boolean(isActive);

        await plan.save();

        res.status(200).json({
            success: true,
            message: `Plan "${plan.name}" updated successfully.`,
            plan
        });
    } catch (error) {
        console.error("Error updating plan:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update plan",
            error: error.message
        });
    }
};

// Admin 3: Create a new plan
const createAdminPlan = async (req, res) => {
    try {
        const {
            name,
            tierKey,
            badge,
            description,
            monthlyPrice,
            annualPrice,
            productLimit,
            durationInDays,
            features,
            popular,
            colorTheme
        } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Plan name is required" });
        }

        const price = Number(monthlyPrice || 0);

        const newPlan = await SubscriptionPlan.create({
            name,
            tierKey: tierKey || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            badge: badge || "Tier",
            description: description || "",
            price,
            monthlyPrice: price,
            annualPrice: Number(annualPrice || price * 10),
            productLimit: Number(productLimit || 50),
            durationInDays: Number(durationInDays || 30),
            features: Array.isArray(features) ? features : [],
            popular: Boolean(popular),
            colorTheme: colorTheme || "slate",
            isActive: true
        });

        res.status(201).json({
            success: true,
            message: "Subscription plan created successfully",
            plan: newPlan
        });
    } catch (error) {
        console.error("Error creating plan:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create plan",
            error: error.message
        });
    }
};

// Admin 4: Delete / Deactivate a plan
const deleteAdminPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await SubscriptionPlan.findByPk(id);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Subscription plan not found" });
        }

        const activeCount = await VendorSubscription.count({
            where: { planId: id, status: "active" }
        });

        if (activeCount > 0) {
            plan.isActive = false;
            await plan.save();
            return res.status(200).json({
                success: true,
                message: `Plan "${plan.name}" has ${activeCount} active subscriptions and has been marked as inactive.`
            });
        }

        await plan.destroy();
        res.status(200).json({
            success: true,
            message: `Plan "${plan.name}" removed successfully.`
        });
    } catch (error) {
        console.error("Error deleting plan:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete plan",
            error: error.message
        });
    }
};

module.exports = {
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
};
