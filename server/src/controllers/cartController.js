const { sequelize } = require("../config/db");
const { CartItem, Product, ProductVariant, Vendor, Category, SubCategory, Order, OrderItem, User } = require("../models");
const transporter = require("../config/mail");

// Helper: Calculate Cart Totals
const computeCartTotals = (cartItems) => {
    let subTotal = 0;
    let totalItems = 0;
    const vendorMap = {};

    const items = cartItems.map((item) => {
        const product = item.product;
        const variant = item.variant;

        let unitPrice = product.discountPrice ? Number(product.discountPrice) : Number(product.price);
        let availableStock = product.stock;
        let isAvailable = product.status === "active" && product.stock > 0;
        let displayName = product.name;
        let displayImages = product.images;

        if (variant) {
            unitPrice = variant.discountPrice ? Number(variant.discountPrice) : Number(variant.price);
            availableStock = variant.stock;
            isAvailable = product.status === "active" && variant.status === "active" && variant.stock > 0;
            displayName = `${product.name} (${variant.name})`;
            if (variant.images && variant.images.length > 0) {
                displayImages = variant.images;
            }
        }

        const isStockSufficient = availableStock >= item.quantity;
        const lineTotal = unitPrice * item.quantity;

        subTotal += lineTotal;
        totalItems += item.quantity;

        // Group by vendor
        const vendorId = product.vendorId;
        const vendorName = product.vendor ? product.vendor.storeName : "Unknown Store";

        if (!vendorMap[vendorId]) {
            vendorMap[vendorId] = {
                vendorId,
                storeName: vendorName,
                vendorSubtotal: 0,
                items: []
            };
        }
        vendorMap[vendorId].vendorSubtotal += lineTotal;

        const itemData = {
            id: item.id,
            productId: product.id,
            variantId: variant ? variant.id : null,
            variantName: variant ? variant.name : null,
            variantAttributes: variant ? variant.attributes : null,
            name: displayName,
            sku: variant && variant.sku ? variant.sku : product.sku,
            images: displayImages,
            unitPrice,
            originalPrice: variant ? Number(variant.price) : Number(product.price),
            discountPrice: variant ? (variant.discountPrice ? Number(variant.discountPrice) : null) : (product.discountPrice ? Number(product.discountPrice) : null),
            quantity: item.quantity,
            lineTotal,
            availableStock,
            isAvailable,
            isStockSufficient,
            vendor: {
                id: product.vendorId,
                storeName: vendorName
            },
            category: product.category ? { id: product.category.id, name: product.category.name } : null,
            subCategory: product.subCategory ? { id: product.subCategory.id, name: product.subCategory.name } : null
        };

        vendorMap[vendorId].items.push(itemData);
        return itemData;
    });

    // Shipping logic: Free shipping over ₹999, else ₹50
    const shippingAmount = subTotal >= 999 || subTotal === 0 ? 0 : 50;
    // Estimated tax: 5%
    const taxAmount = Number((subTotal * 0.05).toFixed(2));
    const grandTotal = Number((subTotal + shippingAmount + taxAmount).toFixed(2));

    return {
        items,
        vendorBreakdown: Object.values(vendorMap),
        summary: {
            distinctProducts: items.length,
            totalItems,
            subTotal: Number(subTotal.toFixed(2)),
            shippingAmount,
            taxAmount,
            grandTotal
        }
    };
};

// 1. Get Current User's Cart
const getCart = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Product,
                    as: "product",
                    include: [
                        { model: Vendor, as: "vendor", attributes: ["id", "storeName", "businessName"] },
                        { model: Category, as: "category", attributes: ["id", "name"] },
                        { model: SubCategory, as: "subCategory", attributes: ["id", "name"] }
                    ]
                },
                {
                    model: ProductVariant,
                    as: "variant"
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        const cartData = computeCartTotals(cartItems);

        res.status(200).json({
            message: "Cart retrieved successfully",
            cart: cartData
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({
            message: "Failed to fetch cart",
            error: error.message
        });
    }
};

// 2. Add Product / Variant to Cart
const addToCart = async (req, res) => {
    try {
        const { productId, variantId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }

        const qty = quantity ? Math.max(1, parseInt(quantity, 10)) : 1;

        // Check if product exists and is available
        const product = await Product.findByPk(productId, {
            include: [
                { model: Vendor, as: "vendor", attributes: ["id", "storeName"] },
                { model: ProductVariant, as: "variants" }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.status !== "active") {
            return res.status(400).json({ message: "This product is currently inactive or unavailable" });
        }

        let variant = null;
        let targetStock = product.stock;

        // If product has variants, variantId is strongly recommended/required
        if (variantId) {
            variant = await ProductVariant.findOne({
                where: { id: variantId, productId: product.id }
            });

            if (!variant) {
                return res.status(404).json({ message: "Specified product variant was not found" });
            }

            if (variant.status !== "active") {
                return res.status(400).json({ message: `Variant '${variant.name}' is currently unavailable` });
            }

            targetStock = variant.stock;
        } else if (product.hasVariants && product.variants && product.variants.length > 0) {
            // Default to first active variant if none chosen
            variant = product.variants.find(v => v.status === "active") || product.variants[0];
            targetStock = variant ? variant.stock : product.stock;
        }

        if (targetStock <= 0) {
            return res.status(400).json({
                message: variant ? `Variant '${variant.name}' is currently out of stock` : "This product is currently out of stock"
            });
        }

        // Check if item (product + variant combination) is already in user's cart
        const whereClause = {
            userId: req.user.id,
            productId: product.id,
            variantId: variant ? variant.id : null
        };

        let cartItem = await CartItem.findOne({ where: whereClause });

        if (cartItem) {
            const newQuantity = cartItem.quantity + qty;
            if (newQuantity > targetStock) {
                return res.status(400).json({
                    message: `Cannot add ${qty} more. You already have ${cartItem.quantity} in cart, and only ${targetStock} are available in stock.`,
                    availableStock: targetStock,
                    currentInCart: cartItem.quantity
                });
            }
            cartItem.quantity = newQuantity;
            await cartItem.save();
        } else {
            if (qty > targetStock) {
                return res.status(400).json({
                    message: `Requested quantity (${qty}) exceeds available stock (${targetStock}).`,
                    availableStock: targetStock
                });
            }
            cartItem = await CartItem.create({
                userId: req.user.id,
                productId: product.id,
                variantId: variant ? variant.id : null,
                quantity: qty
            });
        }

        const itemName = variant ? `${product.name} (${variant.name})` : product.name;

        res.status(200).json({
            message: `Added '${itemName}' to cart successfully`,
            cartItem
        });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({
            message: "Failed to add item to cart",
            error: error.message
        });
    }
};

// 3. Update Cart Item Quantity
const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || isNaN(Number(quantity))) {
            return res.status(400).json({ message: "A valid quantity number is required" });
        }

        const qty = parseInt(quantity, 10);

        const cartItem = await CartItem.findOne({
            where: {
                userId: req.user.id,
                [sequelize.Sequelize.Op.or]: [
                    { id: isNaN(Number(id)) ? 0 : Number(id) },
                    { productId: isNaN(Number(id)) ? 0 : Number(id) }
                ]
            },
            include: [
                { model: Product, as: "product" },
                { model: ProductVariant, as: "variant" }
            ]
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Item not found in your cart" });
        }

        // If quantity is 0 or less, remove item
        if (qty <= 0) {
            await cartItem.destroy();
            return res.status(200).json({
                message: "Item removed from cart because quantity was set to 0",
                removed: true
            });
        }

        // Check stock availability (variant or product)
        const availableStock = cartItem.variant ? cartItem.variant.stock : cartItem.product.stock;
        if (qty > availableStock) {
            return res.status(400).json({
                message: `Requested quantity (${qty}) exceeds available stock (${availableStock})`,
                availableStock
            });
        }

        cartItem.quantity = qty;
        await cartItem.save();

        res.status(200).json({
            message: "Cart item updated successfully",
            cartItem
        });
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({
            message: "Failed to update cart item",
            error: error.message
        });
    }
};

// 4. Remove Item from Cart
const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;

        const cartItem = await CartItem.findOne({
            where: {
                userId: req.user.id,
                [sequelize.Sequelize.Op.or]: [
                    { id: isNaN(Number(id)) ? 0 : Number(id) },
                    { productId: isNaN(Number(id)) ? 0 : Number(id) }
                ]
            }
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Item not found in your cart" });
        }

        await cartItem.destroy();

        res.status(200).json({
            message: "Item removed from cart successfully"
        });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({
            message: "Failed to remove item from cart",
            error: error.message
        });
    }
};

// 5. Clear Entire Cart
const clearCart = async (req, res) => {
    try {
        await CartItem.destroy({
            where: { userId: req.user.id }
        });

        res.status(200).json({
            message: "Cart cleared successfully"
        });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({
            message: "Failed to clear cart",
            error: error.message
        });
    }
};

// 6. Checkout Preview (Pre-checkout validation & price calculation)
const checkoutPreview = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Product,
                    as: "product",
                    include: [
                        { model: Vendor, as: "vendor", attributes: ["id", "storeName", "businessName"] },
                        { model: Category, as: "category", attributes: ["id", "name"] }
                    ]
                },
                {
                    model: ProductVariant,
                    as: "variant"
                }
            ]
        });

        if (cartItems.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty. Add products to cart before proceeding to checkout."
            });
        }

        const cartData = computeCartTotals(cartItems);

        // Check if any items are out of stock or have insufficient stock
        const stockIssues = [];
        for (const item of cartData.items) {
            if (!item.isAvailable) {
                stockIssues.push(`'${item.name}' is currently unavailable`);
            } else if (!item.isStockSufficient) {
                stockIssues.push(`'${item.name}' has only ${item.availableStock} in stock, but you requested ${item.quantity}`);
            }
        }

        res.status(200).json({
            canProceedToCheckout: stockIssues.length === 0,
            stockIssues,
            checkout: {
                ...cartData,
                supportedPaymentMethods: ["cod", "card", "upi", "netbanking"]
            }
        });
    } catch (error) {
        console.error("Error in checkoutPreview:", error);
        res.status(500).json({
            message: "Failed to generate checkout preview",
            error: error.message
        });
    }
};

// 7. Execute Checkout (Place Order)
const checkout = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            shippingAddress,
            paymentMethod = "cod",
            notes
        } = req.body;

        if (!shippingAddress) {
            await t.rollback();
            return res.status(400).json({ message: "Shipping address is required" });
        }

        const { fullName, phone, addressLine1, city, state, postalCode } = shippingAddress;
        if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
            await t.rollback();
            return res.status(400).json({
                message: "Full name, phone, addressLine1, city, state, and postalCode are required in shippingAddress"
            });
        }

        // Fetch user's cart items with variants
        const cartItems = await CartItem.findAll({
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

        if (cartItems.length === 0) {
            await t.rollback();
            return res.status(400).json({ message: "Cannot checkout: your cart is empty" });
        }

        // Validate stock and compute totals inside transaction
        let subTotal = 0;
        const validatedItems = [];

        for (const item of cartItems) {
            const product = item.product;
            const variant = item.variant;

            if (!product || product.status !== "active") {
                await t.rollback();
                return res.status(400).json({
                    message: `Product '${product ? product.name : "Unknown"}' is no longer active or available.`
                });
            }

            const availableStock = variant ? variant.stock : product.stock;
            const itemName = variant ? `${product.name} (${variant.name})` : product.name;

            if (availableStock < item.quantity) {
                await t.rollback();
                return res.status(400).json({
                    message: `Insufficient stock for '${itemName}'. Available: ${availableStock}, requested: ${item.quantity}.`
                });
            }

            let unitPrice = product.discountPrice ? Number(product.discountPrice) : Number(product.price);
            if (variant) {
                unitPrice = variant.discountPrice ? Number(variant.discountPrice) : Number(variant.price);
            }

            const lineTotal = unitPrice * item.quantity;
            subTotal += lineTotal;

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

        const shippingAmount = subTotal >= 999 ? 0 : 50;
        const taxAmount = Number((subTotal * 0.05).toFixed(2));
        const totalAmount = Number((subTotal + shippingAmount + taxAmount).toFixed(2));

        // Generate unique order number
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `ORD-${dateStr}-${randSuffix}-U${req.user.id}`;

        // Create Order
        const order = await Order.create({
            orderNumber,
            userId: req.user.id,
            subTotal,
            shippingAmount,
            taxAmount,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentMethod === "cod" ? "pending" : "completed",
            orderStatus: "placed",
            notes: notes ? notes.trim() : null
        }, { transaction: t });

        // Create OrderItems & Decrement Stock
        const orderItemsData = [];
        for (const item of validatedItems) {
            const product = item.product;
            const variant = item.variant;

            const orderItem = await OrderItem.create({
                orderId: order.id,
                productId: product.id,
                variantId: variant ? variant.id : null,
                variantName: variant ? variant.name : null,
                vendorId: product.vendorId,
                productName: item.itemName,
                productPrice: item.unitPrice,
                quantity: item.quantity,
                totalPrice: item.lineTotal,
                productImage: item.displayImage,
                status: "pending"
            }, { transaction: t });

            orderItemsData.push(orderItem);

            // Deduct stock from variant if present
            if (variant) {
                variant.stock = Math.max(0, variant.stock - item.quantity);
                if (variant.stock === 0) {
                    variant.status = "out_of_stock";
                }
                await variant.save({ transaction: t });
            }

            // Deduct overall product stock
            product.stock = Math.max(0, product.stock - item.quantity);
            if (product.stock === 0) {
                product.status = "out_of_stock";
            }
            await product.save({ transaction: t });
        }

        // Clear User's Cart
        await CartItem.destroy({
            where: { userId: req.user.id },
            transaction: t
        });

        // Commit transaction
        await t.commit();

        // Send Order Confirmation Email
        try {
            await transporter.sendMail({
                from: `"MultiVendor App" <${process.env.EMAIL_USER}>`,
                to: req.user.email,
                subject: `Order Confirmed: ${orderNumber} 🎉`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h2 style="color: #2563eb; margin-top: 0;">Thank You for Your Order! 🎉</h2>
                        <p>Hello <strong>${fullName}</strong>,</p>
                        <p>Your order <strong>${orderNumber}</strong> has been placed successfully and is being prepared by our sellers.</p>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #334155;">Order Summary</h3>
                            <p style="margin: 4px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
                            <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
                            <p style="margin: 4px 0;"><strong>Shipping To:</strong> ${addressLine1}, ${city}, ${state} - ${postalCode}</p>
                            <p style="margin: 4px 0; font-size: 16px; color: #1e40af;"><strong>Total Paid:</strong> ₹${totalAmount}</p>
                        </div>
                    </div>
                `,
                text: `Hello ${fullName},\n\nYour order ${orderNumber} for ₹${totalAmount} has been placed successfully!`
            });
        } catch (mailErr) {
            console.error("Warning: Failed to send order confirmation email:", mailErr.message);
        }

        res.status(201).json({
            message: "Order placed successfully!",
            orderNumber: order.orderNumber,
            order,
            items: orderItemsData
        });

    } catch (error) {
        if (!t.finished) {
            await t.rollback();
        }
        console.error("Error during checkout:", error);
        res.status(500).json({
            message: "Failed to complete checkout and place order",
            error: error.message
        });
    }
};

// 8. Merge/Sync Guest Cart Items into Logged-in User's Cart
const syncCart = async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            const currentItems = await CartItem.findAll({
                where: { userId: req.user.id },
                include: [
                    {
                        model: Product,
                        as: "product",
                        include: [
                            { model: Vendor, as: "vendor", attributes: ["id", "storeName", "businessName"] },
                            { model: Category, as: "category", attributes: ["id", "name"] },
                            { model: SubCategory, as: "subCategory", attributes: ["id", "name"] }
                        ]
                    },
                    { model: ProductVariant, as: "variant" }
                ],
                order: [["createdAt", "DESC"]]
            });
            return res.status(200).json({
                message: "Cart retrieved successfully",
                cart: computeCartTotals(currentItems)
            });
        }

        for (const guestItem of items) {
            const pId = Number(guestItem.productId || guestItem.id);
            if (!pId) continue;
            const vId = guestItem.variantId ? Number(guestItem.variantId) : null;
            const qty = Math.max(1, parseInt(guestItem.quantity, 10) || 1);

            const product = await Product.findByPk(pId);
            if (!product || product.status !== "active") continue;

            let targetStock = product.stock;
            if (vId) {
                const variant = await ProductVariant.findOne({ where: { id: vId, productId: pId } });
                if (!variant || variant.status !== "active") continue;
                targetStock = variant.stock;
            }

            const whereClause = {
                userId: req.user.id,
                productId: pId
            };
            if (vId) whereClause.variantId = vId;

            let existing = await CartItem.findOne({ where: whereClause });
            if (existing) {
                const combinedQty = Math.min(existing.quantity + qty, targetStock);
                existing.quantity = combinedQty;
                await existing.save();
            } else {
                const initialQty = Math.min(qty, targetStock);
                if (initialQty > 0) {
                    await CartItem.create({
                        userId: req.user.id,
                        productId: pId,
                        variantId: vId,
                        quantity: initialQty
                    });
                }
            }
        }

        const updatedCartItems = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Product,
                    as: "product",
                    include: [
                        { model: Vendor, as: "vendor", attributes: ["id", "storeName", "businessName"] },
                        { model: Category, as: "category", attributes: ["id", "name"] },
                        { model: SubCategory, as: "subCategory", attributes: ["id", "name"] }
                    ]
                },
                { model: ProductVariant, as: "variant" }
            ],
            order: [["createdAt", "DESC"]]
        });

        const cartData = computeCartTotals(updatedCartItems);
        res.status(200).json({
            message: "Guest cart merged successfully with user cart",
            cart: cartData
        });
    } catch (error) {
        console.error("Error syncing cart:", error);
        res.status(500).json({
            message: "Failed to sync cart",
            error: error.message
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkoutPreview,
    checkout,
    syncCart
};
