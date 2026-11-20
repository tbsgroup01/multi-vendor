const { Op, col, fn } = require("sequelize");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const { Vendor, User, Product, OrderItem, Order, Category } = require("../models");
const transporter = require("../config/mail");

const invalidImageError = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const persistImageDataUrl = async (value, directory) => {
    if (typeof value !== "string" || !value.startsWith("data:")) {
        return value;
    }

    const match = value.match(/^data:(image\/[a-zA-Z0-9.+_-]+);base64,([\s\S]+)$/);
    if (!match) {
        throw invalidImageError("Invalid image data");
    }

    const mimeType = match[1].toLowerCase();
    const base64Data = match[2].trim().replace(/\s+/g, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    if (imageBuffer.length > 5 * 1024 * 1024) {
        throw invalidImageError("Image must be smaller than 5 MB");
    }

    const extensionByMimeType = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
        "image/svg+xml": "svg"
    };
    const extension = extensionByMimeType[mimeType] || "png";
    const filename = `${directory}-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${extension}`;
    const uploadDirectory = path.join(__dirname, "../../uploads", directory);

    await fs.mkdir(uploadDirectory, { recursive: true });
    await fs.writeFile(path.join(uploadDirectory, filename), imageBuffer);
    return `/uploads/${directory}/${filename}`;
};

const getMyVendorDashboard = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor) {
            const userName = req.user.name || "Vendor";
            vendor = await Vendor.create({
                userId: req.user.id,
                storeName: `${userName}'s Store`,
                businessName: `${userName} Retail`,
                gstNumber: `GST_${Date.now().toString().slice(-8)}`,
                category: "General",
                status: "approved",
                plan: "starter",
                productsLimit: 50
            });
            vendor.user = req.user;
        }

        const weekStart = new Date();
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));

        const revenueWhere = {
            vendorId: vendor.id,
            status: { [Op.ne]: "cancelled" }
        };
        const [
            totalRevenue,
            totalOrders,
            activeProducts,
            pendingOrders,
            weeklyItems,
            recentOrderItems,
            categoryRows
        ] = await Promise.all([
            OrderItem.sum("totalPrice", { where: revenueWhere }),
            OrderItem.count({ where: { vendorId: vendor.id }, distinct: true, col: "orderId" }),
            Product.count({ where: { vendorId: vendor.id, status: "active" } }),
            OrderItem.count({
                where: { vendorId: vendor.id, status: "pending" },
                distinct: true,
                col: "orderId"
            }),
            OrderItem.findAll({
                where: {
                    ...revenueWhere,
                    createdAt: { [Op.gte]: weekStart }
                },
                attributes: ["totalPrice", "createdAt"],
                raw: true
            }),
            OrderItem.findAll({
                where: { vendorId: vendor.id },
                attributes: ["id", "orderId", "productName", "productImage", "totalPrice", "status", "createdAt"],
                include: [{
                    model: Order,
                    as: "order",
                    attributes: ["orderNumber", "paymentMethod", "paymentStatus", "createdAt"]
                }],
                order: [["createdAt", "DESC"]],
                limit: 50
            }),
            Product.findAll({
                where: { vendorId: vendor.id, status: "active" },
                attributes: ["categoryId", [fn("COUNT", col("Product.id")), "productCount"]],
                include: [{
                    model: Category,
                    as: "category",
                    attributes: ["id", "name", "image"]
                }],
                group: ["Product.categoryId", "category.id", "category.name", "category.image"],
                order: [[fn("COUNT", col("Product.id")), "DESC"]],
                limit: 4,
                subQuery: false
            })
        ]);

        const dailySales = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + index);
            return {
                day: date.toLocaleDateString("en-US", { weekday: "short" }),
                date: date.toISOString().slice(0, 10),
                total: 0
            };
        });
        for (const item of weeklyItems) {
            const dayIndex = (new Date(item.createdAt).getDay() + 6) % 7;
            if (dayIndex >= 0 && dayIndex < dailySales.length) {
                dailySales[dayIndex].total += Number(item.totalPrice) || 0;
            }
        }

        res.status(200).json({
            storeName: vendor.storeName,
            stats: {
                totalRevenue: Number(totalRevenue) || 0,
                totalOrders,
                activeProducts,
                pendingOrders
            },
            weeklySales: dailySales,
            recentOrderItems,
            categories: categoryRows.map((row) => ({
                id: row.category?.id || row.categoryId,
                name: row.category?.name || "Uncategorized",
                image: row.category?.image || "",
                productsCount: Number(row.get("productCount")) || 0
            }))
        });
    } catch (error) {
        console.error("Error fetching vendor dashboard:", error);
        res.status(500).json({
            message: "Failed to fetch vendor dashboard",
            error: error.message
        });
    }
};

const formatNotificationDate = (date) => {
    if (!date) return { time: "Just now", date: "Today" };
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let time = "Just now";
    if (diffMins < 1) time = "Just now";
    else if (diffMins < 60) time = `${diffMins} mins ago`;
    else if (diffHours < 24) time = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    else if (diffDays === 1) time = "Yesterday";
    else time = `${diffDays} days ago`;

    const timeString = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    let dateStr = "";
    if (diffDays === 0) dateStr = `Today, ${timeString}`;
    else if (diffDays === 1) dateStr = `Yesterday, ${timeString}`;
    else dateStr = d.toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

    return { time, date: dateStr };
};

const getMyVendorNotifications = async (req, res) => {
    try {
        let vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor && req.user.role === "admin") {
            vendor = await Vendor.findOne();
        }
        if (!vendor) {
            const userName = req.user.name || "Vendor";
            vendor = await Vendor.create({
                userId: req.user.id,
                storeName: `${userName}'s Store`,
                businessName: `${userName} Retail`,
                gstNumber: `GST_${Date.now().toString().slice(-8)}`,
                category: "General",
                status: "approved",
                plan: "starter",
                productsLimit: 50
            });
            vendor.user = req.user;
        }

        const items = await OrderItem.findAll({
            where: { vendorId: vendor.id },
            include: [{
                model: Order,
                as: "order",
                attributes: ["id", "orderNumber", "orderStatus", "paymentMethod", "paymentStatus", "createdAt", "updatedAt"],
                include: [{
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"]
                }]
            }],
            order: [["createdAt", "DESC"]],
            limit: 100
        });

        const ordersMap = new Map();
        items.forEach((item) => {
            const order = item.order;
            if (!order) return;
            if (!ordersMap.has(order.id)) {
                ordersMap.set(order.id, {
                    order,
                    items: [],
                    vendorTotal: 0,
                    itemCount: 0
                });
            }
            const record = ordersMap.get(order.id);
            record.items.push(item);
            record.vendorTotal += Number(item.totalPrice || 0);
            record.itemCount += Number(item.quantity || 1);
        });

        const notifications = [];

        ordersMap.forEach((data, orderId) => {
            const { order, items, vendorTotal, itemCount } = data;
            const customerName = order.user?.name || "Customer";
            const orderNum = order.orderNumber || `ORD-${order.id}`;
            const { time, date } = formatNotificationDate(order.createdAt);
            const totalFormatted = Math.round(vendorTotal).toLocaleString("en-IN");

            // 1. Order Notification
            notifications.push({
                id: `order-${order.id}`,
                type: "order",
                title: `New Order Received #${orderNum}`,
                message: `Customer '${customerName}' placed an order for ${itemCount} item(s) worth ₹${totalFormatted}. Order status: ${order.orderStatus || "placed"}.`,
                category: "orders",
                time,
                date,
                timestamp: order.createdAt,
                link: "/vendor/orders",
                linkText: "View Order",
                amount: vendorTotal,
                orderNumber: orderNum,
                status: order.orderStatus
            });

            // 2. Payment Notification
            const isCompleted = order.paymentStatus === "completed";
            const methodLabel = order.paymentMethod?.toLowerCase() === "cod" 
                ? "Cash on Delivery" 
                : (order.paymentMethod ? order.paymentMethod.toUpperCase() : "Online Payment");

            notifications.push({
                id: `payment-${order.id}`,
                type: "payout",
                title: isCompleted 
                    ? `Payment Received ₹${totalFormatted}`
                    : `Payment Pending ₹${totalFormatted}`,
                message: `Payment of ₹${totalFormatted} via ${methodLabel} for Order #${orderNum} is ${order.paymentStatus || "pending"}.`,
                category: "payouts",
                time,
                date,
                timestamp: order.createdAt,
                link: "/vendor/payments",
                linkText: "View Settlement",
                amount: vendorTotal,
                orderNumber: orderNum,
                paymentStatus: order.paymentStatus,
                paymentMethod: methodLabel
            });
        });

        notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        console.error("Error fetching vendor notifications:", error);
        res.status(500).json({
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
};

const getMyVendorSettings = async (req, res) => {
    try {
        let vendor = await Vendor.findOne({
            where: { userId: req.user.id },
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "name", "email", "phone", "avatar", "designation", "isVerified"]
            }]
        });

        if (!vendor && req.user.role === "admin") {
            vendor = await Vendor.findOne({
                include: [{
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone", "avatar", "designation", "isVerified"]
                }]
            });
        }

        if (!vendor) {
            const userName = req.user.name || "Vendor";
            vendor = await Vendor.create({
                userId: req.user.id,
                storeName: `${userName}'s Store`,
                businessName: `${userName} Retail`,
                gstNumber: `GST_${Date.now().toString().slice(-8)}`,
                category: "General",
                status: "approved",
                plan: "starter",
                productsLimit: 50
            });
            vendor.user = req.user;
        }

        let vendorObj = vendor.toJSON ? vendor.toJSON() : vendor;
        if (typeof vendorObj.storeSettings === "string") {
            try {
                vendorObj.storeSettings = JSON.parse(vendorObj.storeSettings);
            } catch {
                vendorObj.storeSettings = {};
            }
        }

        res.status(200).json({ vendor: vendorObj });
    } catch (error) {
        console.error("Error fetching vendor settings:", error);
        res.status(500).json({
            message: "Failed to fetch vendor settings",
            error: error.message
        });
    }
};

const updateMyVendorSettings = async (req, res) => {
    try {
        let vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor && req.user.role === "admin") {
            vendor = await Vendor.findOne();
        }
        if (!vendor) {
            const userName = req.user.name || "Vendor";
            vendor = await Vendor.create({
                userId: req.user.id,
                storeName: `${userName}'s Store`,
                businessName: `${userName} Retail`,
                gstNumber: `GST_${Date.now().toString().slice(-8)}`,
                category: "General",
                status: "approved",
                plan: "starter",
                productsLimit: 50
            });
            vendor.user = req.user;
        }

        const targetUserId = (req.user.role === "admin" && vendor.userId) ? vendor.userId : req.user.id;
        const user = await User.findByPk(targetUserId);
        if (!user) {
            return res.status(404).json({ message: "User profile not found" });
        }

        const { profile, store } = req.body || {};
        if (!profile && !store) {
            return res.status(400).json({ message: "Profile or store settings are required" });
        }

        if (profile) {
            const name = String(profile.name || "").trim();
            const email = String(profile.email || "").trim().toLowerCase();
            const phone = String(profile.phone || "").replace(/\D/g, "");
            const designation = String(profile.designation || "").trim();
            const avatar = profile.avatar == null ? null : String(profile.avatar);

            if (!name || !email || !phone) {
                return res.status(400).json({ message: "Name, email, and phone are required" });
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ message: "Enter a valid email address" });
            }
            if (!/^\d{10}$/.test(phone)) {
                return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
            }

            const emailExists = await User.findOne({
                where: { email, id: { [Op.ne]: user.id } }
            });
            if (emailExists) {
                return res.status(409).json({ message: "Email address is already in use" });
            }

            const phoneExists = await User.findOne({
                where: { phone, id: { [Op.ne]: user.id } }
            });
            if (phoneExists) {
                return res.status(409).json({ message: "Phone number is already in use" });
            }

            if (avatar && avatar.length > 3_000_000) {
                return res.status(400).json({ message: "Profile image must be smaller than 2 MB" });
            }

            if (email !== user.email) {
                user.isVerified = false;
            }
            user.name = name;
            user.email = email;
            user.phone = phone;
            user.avatar = await persistImageDataUrl(avatar, "avatars");
            user.designation = designation || null;
            await user.save();
        }

        if (store) {
            const allowedSettings = [
                "storeSlug",
                "tagline",
                "logo",
                "banner",
                "supportEmail",
                "supportPhone",
                "pan",
                "address",
                "city",
                "state",
                "pincode"
            ];
            let currentSettings = vendor.storeSettings;
            if (typeof currentSettings === "string") {
                try {
                    currentSettings = JSON.parse(currentSettings);
                } catch {
                    currentSettings = {};
                }
            }
            if (!currentSettings || typeof currentSettings !== "object" || Array.isArray(currentSettings)) {
                currentSettings = {};
            }
            const storeSettings = { ...currentSettings };

            if (Object.prototype.hasOwnProperty.call(store, "storeName")) {
                const storeName = String(store.storeName || "").trim();
                if (!storeName) {
                    return res.status(400).json({ message: "Store name is required" });
                }
                vendor.storeName = storeName;
            }

            if (Object.prototype.hasOwnProperty.call(store, "companyName")) {
                const businessName = String(store.companyName || "").trim();
                if (!businessName) {
                    return res.status(400).json({ message: "Registered business name is required" });
                }
                vendor.businessName = businessName;
            }

            if (Object.prototype.hasOwnProperty.call(store, "gstin")) {
                const gstNumber = String(store.gstin || "").trim().toUpperCase();
                if (!gstNumber) {
                    return res.status(400).json({ message: "GSTIN is required" });
                }
                const gstExists = await Vendor.findOne({
                    where: { gstNumber, id: { [Op.ne]: vendor.id } }
                });
                if (gstExists) {
                    return res.status(409).json({ message: "GSTIN is already registered" });
                }
                vendor.gstNumber = gstNumber;
            }

            if (Object.prototype.hasOwnProperty.call(store, "businessType")) {
                const category = String(store.businessType || "").trim();
                if (!category) {
                    return res.status(400).json({ message: "Business type is required" });
                }
                vendor.category = category;
            }

            if (Object.prototype.hasOwnProperty.call(store, "pan") && !String(store.pan || "").trim()) {
                return res.status(400).json({ message: "PAN is required" });
            }

            for (const key of allowedSettings) {
                if (Object.prototype.hasOwnProperty.call(store, key)) {
                    if (typeof store[key] !== "string") {
                        return res.status(400).json({ message: `Invalid store setting: ${key}` });
                    }
                    const value = store[key].trim();
                    if (["address", "city", "state"].includes(key) && !value) {
                        return res.status(400).json({ message: `${key} is required` });
                    }
                    storeSettings[key] = value;
                }
            }

            if (storeSettings.logo && storeSettings.logo.length > 3_000_000) {
                return res.status(400).json({ message: "Store logo must be smaller than 2 MB" });
            }
            if (storeSettings.banner && storeSettings.banner.length > 3_000_000) {
                return res.status(400).json({ message: "Store banner must be smaller than 2 MB" });
            }

            storeSettings.logo = await persistImageDataUrl(storeSettings.logo, "vendors");
            storeSettings.banner = await persistImageDataUrl(storeSettings.banner, "vendors");
            vendor.storeSettings = storeSettings;
            await vendor.save();
        }

        const updatedVendor = await Vendor.findByPk(vendor.id, {
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "name", "email", "phone", "avatar", "designation", "isVerified"]
            }]
        });
        let vendorResponse = updatedVendor.toJSON ? updatedVendor.toJSON() : updatedVendor;
        if (typeof vendorResponse.storeSettings === "string") {
            try {
                vendorResponse.storeSettings = JSON.parse(vendorResponse.storeSettings);
            } catch {
                vendorResponse.storeSettings = {};
            }
        }
        res.status(200).json({ message: "Vendor settings saved successfully", vendor: vendorResponse });
    } catch (error) {
        console.error("Error updating vendor settings:", error);
        res.status(error.statusCode || 500).json({
            message: error.statusCode === 400 ? error.message : "Failed to update vendor settings",
            error: error.message
        });
    }
};

// Get all vendors (with optional status filter: ?status=pending)
const getAllVendors = async (req, res) => {
    try {
        const { status } = req.query;
        const whereClause = {};

        if (status) {
            whereClause.status = status.toLowerCase();
        }

        const vendors = await Vendor.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone", "role", "isVerified", "createdAt"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            count: vendors.length,
            vendors
        });
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({
            message: "Failed to fetch vendors",
            error: error.message
        });
    }
};

// Get single vendor by ID
const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await Vendor.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone", "role", "isVerified", "createdAt"]
                }
            ]
        });

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        // Only admin or the vendor themselves can view this profile
        if (req.user.role !== "admin" && req.user.id !== vendor.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({ vendor });
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({
            message: "Failed to fetch vendor",
            error: error.message
        });
    }
};

// Admin approve vendor
const approveVendor = async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await Vendor.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ]
        });

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (vendor.status === "approved") {
            return res.status(400).json({ message: "Vendor is already approved" });
        }

        vendor.status = "approved";
        await vendor.save();

        // Mark associated user account as verified
        await User.update({ isVerified: true }, { where: { id: vendor.userId } });

        // Send approval notification email to vendor
        if (vendor.user && vendor.user.email) {
            try {
                await transporter.sendMail({
                    from: `"MultiVendor App" <${process.env.EMAIL_USER}>`,
                    to: vendor.user.email,
                    subject: "Your Vendor Account Has Been Approved! 🎉",
                    text: `Hello ${vendor.user.name},\n\nCongratulations! Your vendor store '${vendor.storeName}' has been approved by the admin.\n\nYou can now log in to your vendor dashboard, list products, and start selling!\n\nBest regards,\nMultiVendor Team`
                });
            } catch (mailError) {
                console.error("Warning: Failed to send vendor approval email:", mailError.message);
            }
        }

        res.status(200).json({
            message: "Vendor approved successfully",
            vendor
        });
    } catch (error) {
        console.error("Error approving vendor:", error);
        res.status(500).json({
            message: "Failed to approve vendor",
            error: error.message
        });
    }
};

// Admin reject vendor
const rejectVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body || {};

        const vendor = await Vendor.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ]
        });

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.status = "rejected";
        await vendor.save();

        // Mark associated user account as unverified
        await User.update({ isVerified: false }, { where: { id: vendor.userId } });

        // Send rejection notification email to vendor
        if (vendor.user && vendor.user.email) {
            try {
                const reasonText = reason ? `\nReason: ${reason}\n` : "";
                await transporter.sendMail({
                    from: `"MultiVendor App" <${process.env.EMAIL_USER}>`,
                    to: vendor.user.email,
                    subject: "MultiVendor App - Vendor Application Update",
                    text: `Hello ${vendor.user.name},\n\nWe regret to inform you that your vendor application for '${vendor.storeName}' has been rejected by our admin team.${reasonText}\nIf you have any questions, please contact our support team.\n\nBest regards,\nMultiVendor Team`
                });
            } catch (mailError) {
                console.error("Warning: Failed to send vendor rejection email:", mailError.message);
            }
        }

        res.status(200).json({
            message: "Vendor application rejected",
            vendor
        });
    } catch (error) {
        console.error("Error rejecting vendor:", error);
        res.status(500).json({
            message: "Failed to reject vendor",
            error: error.message
        });
    }
};

// Admin update status (approved, rejected, or pending)
const updateVendorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body || {};


        if (!status || !["pending", "approved", "rejected"].includes(status.toLowerCase())) {
            return res.status(400).json({
                message: "Status is required and must be 'pending', 'approved', or 'rejected'"
            });
        }

        if (status.toLowerCase() === "approved") {
            return approveVendor(req, res);
        } else if (status.toLowerCase() === "rejected") {
            return rejectVendor(req, res);
        }

        const vendor = await Vendor.findByPk(id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.status = "pending";
        await vendor.save();

        // Ensure user account is unverified while pending
        await User.update({ isVerified: false }, { where: { id: vendor.userId } });

        res.status(200).json({
            message: "Vendor status updated to pending",
            vendor
        });
    } catch (error) {
        console.error("Error updating vendor status:", error);
        res.status(500).json({
            message: "Failed to update vendor status",
            error: error.message
        });
    }
};

// Admin delete vendor
const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findByPk(id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        await vendor.destroy();
        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        console.error("Error deleting vendor:", error);
        res.status(500).json({
            message: "Failed to delete vendor",
            error: error.message
        });
    }
};

module.exports = {
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
};
