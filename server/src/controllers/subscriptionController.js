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

// 1. Get all active plans (Public / Vendor)
const getPublicPlans = async (req, res) => {
    try {
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

module.exports = {
    getPublicPlans,
    getPlanDetails,
    previewPurchase,
    purchasePlan,
    getMySubscription,
    getSubscriptionHistory,
    getInvoiceDetails
};
