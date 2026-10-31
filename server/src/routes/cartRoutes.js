const express = require("express");
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkoutPreview,
    checkout
} = require("../controllers/cartController");
const { protect } = require("../middlewares/authMiddleware");

// All cart operations require authentication
router.use(protect);

// 1. View User's Cart (grouped by vendors with calculations and stock flags)
router.get("/", getCart);

// 2. Add product to cart (or increment if already in cart)
router.post("/add", addToCart);

// 3. Update quantity of a cart item (or remove if quantity <= 0)
router.put("/update/:id", updateCartItem);

// 4. Remove a specific item from cart
router.delete("/remove/:id", removeFromCart);

// 5. Clear all items in user's cart
router.delete("/clear", clearCart);

// 6. Pre-checkout summary & stock validation check
router.get("/checkout-preview", checkoutPreview);

// 7. Place Order / Checkout
router.post("/checkout", checkout);

module.exports = router;
