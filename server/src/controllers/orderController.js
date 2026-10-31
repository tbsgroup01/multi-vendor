const { Order, OrderItem, Product, Vendor, User } = require("../models");

// 1. Get current logged-in user's orders
const getMyOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
        const offset = (pageNum - 1) * limitNum;

        const whereClause = { userId: req.user.id };
        if (status) {
            whereClause.orderStatus = status;
        }

        const { count, rows: orders } = await Order.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include: [
                        { model: Vendor, as: "vendor", attributes: ["id", "storeName", "businessName"] }
                    ]
                }
            ],
            order: [["createdAt", "DESC"]],
            limit: limitNum,
            offset
        });

        res.status(200).json({
            count,
            page: pageNum,
            totalPages: Math.ceil(count / limitNum),
            orders
        });
    } catch (error) {
        console.error("Error fetching my orders:", error);
        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};

// 2. Get specific Order details
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id, {
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include: [
                        { model: Vendor, as: "vendor", attributes: ["id", "storeName", "businessName"] }
                    ]
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Ownership check: User can only see their own order (unless admin)
        if (req.user.role !== "admin" && order.userId !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({
            message: "Failed to fetch order details",
            error: error.message
        });
    }
};

// 3. Vendor view: Get all order items placed for their store
const getVendorOrders = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }

        const { status, page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
        const offset = (pageNum - 1) * limitNum;

        const whereClause = { vendorId: vendor.id };
        if (status) {
            whereClause.status = status;
        }

        const { count, rows: items } = await OrderItem.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Order,
                    as: "order",
                    attributes: ["id", "orderNumber", "shippingAddress", "orderStatus", "paymentMethod", "paymentStatus", "createdAt"],
                    include: [{ model: User, as: "user", attributes: ["id", "name", "email", "phone"] }]
                },
                {
                    model: Product,
                    as: "product",
                    attributes: ["id", "name", "sku", "images"]
                }
            ],
            order: [["createdAt", "DESC"]],
            limit: limitNum,
            offset
        });

        res.status(200).json({
            vendorStore: vendor.storeName,
            count,
            page: pageNum,
            totalPages: Math.ceil(count / limitNum),
            orderItems: items
        });
    } catch (error) {
        console.error("Error fetching vendor orders:", error);
        res.status(500).json({
            message: "Failed to fetch vendor orders",
            error: error.message
        });
    }
};

// 4. Update Order Item Status (Vendor fulfills their part of the order)
const updateOrderItemStatus = async (req, res) => {
    try {
        const { id } = req.params; // OrderItem ID
        const { status } = req.body;

        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Status is required and must be one of: ${validStatuses.join(", ")}`
            });
        }

        const orderItem = await OrderItem.findByPk(id, {
            include: [{ model: Order, as: "order" }]
        });

        if (!orderItem) {
            return res.status(404).json({ message: "Order item not found" });
        }

        // Ownership check
        if (req.user.role === "vendor") {
            const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
            if (!vendor || orderItem.vendorId !== vendor.id) {
                return res.status(403).json({ message: "Access denied: You can only update items from your store" });
            }
        } else if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        orderItem.status = status;
        await orderItem.save();

        res.status(200).json({
            message: `Order item status updated to '${status}'`,
            orderItem
        });
    } catch (error) {
        console.error("Error updating order item status:", error);
        res.status(500).json({
            message: "Failed to update order item status",
            error: error.message
        });
    }
};

module.exports = {
    getMyOrders,
    getOrderById,
    getVendorOrders,
    updateOrderItemStatus
};
