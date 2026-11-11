const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getCurrentUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    resendOtp,
    sendCustomerLoginOtp,
    verifyCustomerLoginOtp,
    getUserAddresses,
    addUserAddress,
    deleteUserAddress
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// Authentication routes
router.post("/register", register);
router.post("/register/vendor", (req, res, next) => {
    req.body.role = "vendor";
    register(req, res, next);
});
router.post("/login", login);
router.post("/send-login-otp", sendCustomerLoginOtp);
router.post("/verify-login-otp", verifyCustomerLoginOtp);
router.get("/me", protect, getCurrentUser);

// Saved Addresses (Database-backed)
router.get("/addresses", protect, getUserAddresses);
router.post("/addresses", protect, addUserAddress);
router.delete("/addresses/:id", protect, deleteUserAddress);

// Password Reset OTP flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);

module.exports = router;