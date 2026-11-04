const crypto = require("crypto");
const { getRazorpayInstance } = require("../config/razorpay");
const { sequelize } = require("../config/db");
const { Order, OrderItem, CartItem, Product, ProductVariant, Vendor, Category, User } = require("../models");
const transporter = require("../config/mail");

// 1. Get Razorpay Public Key ID
const getRazorpayKey = async (req, res) => {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID || "";
        res.status(200).json({ keyId });
    } catch (error) {
        console.error("Error in getRazorpayKey:", error);
        res.status(500).json({ message: "Failed to get Razorpay key", error: error.message });
    }
};

// 2. Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
    try {
        const razorpay = getRazorpayInstance();
        if (!razorpay) {
            return res.status(500).json({
                message: "Razorpay is not configured. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server .env"
            });
        }

        let amountInRupees = req.body.amount;

        // If amount is not passed directly, try to compute from logged-in user's cart
        if (!amountInRupees || Number(amountInRupees) <= 0) {
            if (req.user) {
                const cartItems = await CartItem.findAll({
                    where: { userId: req.user.id },
                    include: [
                        { model: Product, as: "product" },
                        { model: ProductVariant, as: "variant" }
                    ]
                });

                if (cartItems.length > 0) {
                    let subTotal = 0;
                    for (const item of cartItems) {
                        const product = item.product;
                        const variant = item.variant;
                        if (!product || product.status !== "active") continue;

                        let unitPrice = product.discountPrice ? Number(product.discountPrice) : Number(product.price);
                        if (variant) {
                            unitPrice = variant.discountPrice ? Number(variant.discountPrice) : Number(variant.price);
                        }
                        subTotal += unitPrice * item.quantity;
                    }

                    const shippingAmount = subTotal >= 999 ? 0 : 50;
                    const taxAmount = Number((subTotal * 0.05).toFixed(2));
                    amountInRupees = Number((subTotal + shippingAmount + taxAmount).toFixed(2));
                }
            }
        }

        const amountInPaise = Math.round(Number(amountInRupees) * 100);
        if (!amountInPaise || amountInPaise <= 0) {
            return res.status(400).json({ message: "Invalid order amount. Amount must be greater than 0." });
        }

        const userId = req.user ? req.user.id : "guest";
        const receipt = `rcpt_${Date.now().toString().slice(-8)}_${userId}`;

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt,
            notes: {
                userId: String(userId),
                userEmail: req.user?.email || "customer@example.com"
            }
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return res.status(500).json({
            message: "Failed to create Razorpay order",
            error: error.message
        });
    }
};

// 3. Verify Razorpay Payment Signature & Place Order
const verifyRazorpayPayment = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shippingAddress,
            amount,
            notes
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            await t.rollback();
            return res.status(400).json({
                message: "Missing payment verification parameters (razorpay_order_id, razorpay_payment_id, razorpay_signature are required)"
            });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            await t.rollback();
            return res.status(500).json({ message: "Razorpay secret key not found in server environment" });
        }

        // Verify Signature with HMAC SHA256
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: "Payment verification failed: Signature mismatch"
            });
        }

        // Target customer user
        let orderUserId = req.user ? req.user.id : null;
        if (!orderUserId) {
            const customerUser = await User.findOne({ where: { role: "user" } });
            orderUserId = customerUser ? customerUser.id : 1;
        }

        // Default or provided shipping address
        const effectiveAddress = shippingAddress || {
            fullName: req.user?.name || "Customer",
            phone: req.user?.phone || "9999999999",
            addressLine1: "Standard Delivery Address",
            city: "Default City",
            state: "Default State",
            postalCode: "110001"
        };

        // Fetch user's cart items if logged in
        let cartItems = [];
        if (req.user) {
            cartItems = await CartItem.findAll({
                where: { userId: req.user.id },
                include: [
                    {
                        model: Product,
                        as: "product",
                        include: [{ model: Vendor, as: "vendor", attributes: ["id", "storeName"] }]
                    },
                    {
                        model: ProductVariant,
                        as: "variant"
                    }
                ],
                transaction: t,
                lock: true
            });
        }

        let subTotal = 0;
        let shippingAmount = 0;
        let taxAmount = 0;
        let totalAmount = 0;
        const validatedItems = [];

        if (cartItems.length > 0) {
            for (const item of cartItems) {
                const product = item.product;
                const variant = item.variant;

                if (!product) continue;

                let unitPrice = product.discountPrice ? Number(product.discountPrice) : Number(product.price);
                if (variant) {
                    unitPrice = variant.discountPrice ? Number(variant.discountPrice) : Number(variant.price);
                }

                const lineTotal = unitPrice * item.quantity;
                subTotal += lineTotal;

                const itemName = variant ? `${product.name} (${variant.name})` : product.name;
                const displayImage = variant && variant.images && variant.images.length > 0
                    ? variant.images[0]
                    : (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null);

                validatedItems.push({
                    product,
                    variant,
                    unitPrice,
                    quantity: item.quantity,
                    lineTotal,
                    itemName,
                    displayImage
                });
            }

            shippingAmount = subTotal >= 999 ? 0 : 50;
            taxAmount = Number((subTotal * 0.05).toFixed(2));
            totalAmount = Number((subTotal + shippingAmount + taxAmount).toFixed(2));
        } else {
            // Cart in DB is empty (client state checkout)
            totalAmount = Number(amount || 0);
            subTotal = totalAmount;
        }

        // Generate Unique Order Number
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `ORD-${dateStr}-${randSuffix}-U${orderUserId}`;

        // Create Order in DB
        const order = await Order.create({
            orderNumber,
            userId: orderUserId,
            subTotal,
            shippingAmount,
            taxAmount,
            totalAmount,
            shippingAddress: effectiveAddress,
            paymentMethod: "razorpay",
            paymentStatus: "completed",
            orderStatus: "placed",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            notes: notes ? notes.trim() : null
        }, { transaction: t });

        // Create OrderItems & Deduct Stock if items exist
        if (validatedItems.length > 0) {
            for (const item of validatedItems) {
                await OrderItem.create({
                    orderId: order.id,
                    productId: item.product.id,
                    variantId: item.variant ? item.variant.id : null,
                    variantName: item.variant ? item.variant.name : null,
                    vendorId: item.product.vendorId,
                    productName: item.itemName,
                    productPrice: item.unitPrice,
                    quantity: item.quantity,
                    totalPrice: item.lineTotal,
                    productImage: item.displayImage,
                    status: "pending"
                }, { transaction: t });

                if (item.variant) {
                    item.variant.stock = Math.max(0, item.variant.stock - item.quantity);
                    if (item.variant.stock === 0) item.variant.status = "out_of_stock";
                    await item.variant.save({ transaction: t });
                }

                item.product.stock = Math.max(0, item.product.stock - item.quantity);
                if (item.product.stock === 0) item.product.status = "out_of_stock";
                await item.product.save({ transaction: t });
            }

            // Clear cart for logged in user
            if (req.user) {
                await CartItem.destroy({
                    where: { userId: req.user.id },
                    transaction: t
                });
            }
        }

        await t.commit();

        // Send Email Confirmation
        try {
            const recipientEmail = req.user?.email || process.env.EMAIL_USER;
            if (recipientEmail) {
                await transporter.sendMail({
                    from: `"MultiVendor App" <${process.env.EMAIL_USER}>`,
                    to: recipientEmail,
                    subject: `Payment Successful! Order Confirmed: ${orderNumber} 🎉`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px;">
                            <h2 style="color: #059669; margin-top: 0;">Payment Received & Order Confirmed! 🎉</h2>
                            <p>Hello <strong>${effectiveAddress.fullName || "Customer"}</strong>,</p>
                            <p>Your payment via Razorpay was successful, and your order <strong>${orderNumber}</strong> has been placed.</p>
                            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 15px; margin: 20px 0;">
                                <p style="margin: 4px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
                                <p style="margin: 4px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                                <p style="margin: 4px 0;"><strong>Razorpay Order ID:</strong> ${razorpay_order_id}</p>
                                <p style="margin: 4px 0; font-size: 16px; color: #047857;"><strong>Total Paid:</strong> ₹${totalAmount}</p>
                            </div>
                        </div>
                    `
                });
            }
        } catch (mailErr) {
            console.error("Failed to send order email:", mailErr.message);
        }

        return res.status(200).json({
            success: true,
            message: "Razorpay payment verified and order placed successfully",
            orderNumber: order.orderNumber,
            orderId: order.id,
            paymentId: razorpay_payment_id
        });
    } catch (error) {
        await t.rollback();
        console.error("Error verifying Razorpay payment:", error);
        return res.status(500).json({
            message: "Payment verification failed",
            error: error.message
        });
    }
};

module.exports = {
    getRazorpayKey,
    createRazorpayOrder,
    verifyRazorpayPayment
};
