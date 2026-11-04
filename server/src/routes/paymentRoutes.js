const express = require("express");
const router = express.Router();
const {
    getRazorpayKey,
    createRazorpayOrder,
    verifyRazorpayPayment
} = require("../controllers/paymentController");
const { User } = require("../models");
const { verifyToken } = require("../utils/jwt");

// Optional Authentication Middleware:
// If Bearer token is provided, decodes and attaches req.user; if not, allows proceeding as guest.
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (token) {
            try {
                const decoded = verifyToken(token);
                const user = await User.findByPk(decoded.id, {
                    attributes: { exclude: ["password"] }
                });
                if (user) req.user = user;
            } catch (err) {}
        }
    } catch (e) {}
    next();
};

// 1. Get Public Razorpay Key ID
router.get("/key", getRazorpayKey);
router.get("/razorpay-key", getRazorpayKey);

// 2. Create Razorpay Order (Works with logged in user or guest checkout)
router.post("/create-order", optionalAuth, createRazorpayOrder);

// 3. Verify Payment & Confirm Order
router.post("/verify", optionalAuth, verifyRazorpayPayment);

module.exports = router;
