const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getCurrentUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    resendOtp
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// Authentication routes
router.post("/register", register);
router.post("/register/vendor", (req, res, next) => {
    req.body.role = "vendor";
    register(req, res, next);
});
router.post("/login", login);
router.get("/me", protect, getCurrentUser);

// Password Reset OTP flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);

module.exports = router;