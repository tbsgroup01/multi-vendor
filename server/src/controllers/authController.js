const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { User, Vendor } = require("../models");
const transporter = require("../config/mail");
const { generateToken, verifyToken } = require("../utils/jwt");

// Unified register for Customer, Vendor, and Admin
const register = async (req, res) => {
    try {
        const {
            name,
            fullName,
            email,
            phone,
            phoneNumber,
            password,
            role,
            // Vendor specific fields
            businessName,
            storeName,
            gstNumber,
            category,
            primaryCategory
        } = req.body;

        const userName = (name || fullName || "").trim();
        const userEmail = (email || "").toLowerCase().trim();
        const rawPhone = (phone || phoneNumber || "").toString();
        const userPhone = rawPhone.replace(/\D/g, "").trim();
        const userRole = role === "vendor" ? "vendor" : role === "admin" ? "admin" : "user";

        if (!userName || !userEmail || !userPhone || !password) {
            return res.status(400).json({
                message: "Full Name, Email, Phone Number, and Password are required"
            });
        }

        if (!/^\d{10}$/.test(userPhone)) {
            return res.status(400).json({
                message: "Phone number must be exactly 10 digits"
            });
        }

        let vendorBusinessName, vendorStoreName, vendorGstNumber, vendorCategory;
        if (userRole === "vendor") {
            vendorBusinessName = (businessName || "").trim();
            vendorStoreName = (storeName || "").trim();
            vendorGstNumber = (gstNumber || "").trim();
            vendorCategory = (category || primaryCategory || "").trim();

            if (!vendorBusinessName || !vendorStoreName || !vendorGstNumber || !vendorCategory) {
                return res.status(400).json({
                    message: "Vendor registration requires Business Name, Store Name, GST Number, and Primary Category"
                });
            }
        }

        const userExists = await User.findOne({ where: { email: userEmail } });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const phoneExists = await User.findOne({ where: { phone: userPhone } });
        if (phoneExists) {
            return res.status(400).json({ message: "User with this phone number already exists" });
        }

        if (userRole === "vendor") {
            const gstExists = await Vendor.findOne({ where: { gstNumber: vendorGstNumber } });
            if (gstExists) {
                return res.status(400).json({ message: "GST Number is already registered" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const isVerified = true;

        const user = await User.create({
            name: userName,
            email: userEmail,
            phone: userPhone,
            password: hashedPassword,
            role: userRole,
            isVerified: isVerified
        });

        let vendorProfile = null;
        if (userRole === "vendor") {
            vendorProfile = await Vendor.create({
                userId: user.id,
                businessName: vendorBusinessName,
                storeName: vendorStoreName,
                gstNumber: vendorGstNumber,
                category: vendorCategory,
                status: "approved"
            });
        }

        try {
            let emailSubject = "Welcome to MultiVendor App";
            let emailText = `Hello ${userName}, welcome to MultiVendor App!`;

            if (userRole === "vendor") {
                emailSubject = "MultiVendor App - Vendor Application Received (Pending Approval)";
                emailText = `Hello ${userName},\n\nThank you for registering as a vendor with MultiVendor App!\n\nStore Name: ${vendorStoreName}\nBusiness Name: ${vendorBusinessName}\nGST Number: ${vendorGstNumber}\n\nYour vendor account is currently PENDING approval by our administrator. You will receive an email as soon as your store is approved.\n\nBest regards,\nMultiVendor Team`;
            } else if (userRole === "admin") {
                emailSubject = "MultiVendor App - Admin Account Registered";
                emailText = `Hello ${userName},\n\nYour Admin account has been registered successfully.`;
            }

            await transporter.sendMail({
                from: `"MultiVendor App" <${process.env.EMAIL_USER}>`,
                to: userEmail,
                subject: emailSubject,
                text: emailText
            });
        } catch (mailError) {
            console.error("Warning: Failed to send registration email:", mailError.message);
        }

        const token = generateToken({ id: user.id, role: user.role });

        const userData = user.toJSON();
        delete userData.password;
        if (vendorProfile) {
            userData.vendorProfile = vendorProfile;
        }

        const successMessage = userRole === "vendor"
            ? "Vendor registered successfully"
            : `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} registered successfully`;

        res.status(201).json({
            message: successMessage,
            token,
            user: userData
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            message: "Failed to register user",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, phone, emailOrPhone, identifier, password } = req.body;
        const loginIdentifier = (email || phone || emailOrPhone || identifier || "").trim();

        if (!loginIdentifier || !password) {
            return res.status(400).json({
                message: "Email or phone number, and password are required"
            });
        }

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: loginIdentifier.toLowerCase() },
                    { phone: loginIdentifier }
                ]
            },
            include: [
                { model: Vendor, as: "vendorProfile", required: false }
            ]
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found with the provided email or phone number"
            });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credential" });
        }


        if (user.isVerified === false) {
            const message = user.role === "vendor"
                ? "Your vendor account is pending admin approval. You will be able to log in once approved."
                : "User account is not verified";
            return res.status(401).json({ message, isVerified: false });
        }


        const token = generateToken({ id: user.id, role: user.role });

        const userData = user.toJSON();
        delete userData.password;

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: userData
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            message: "Failed to log in user",
            error: error.message
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: req.user });
    } catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({
            message: "Failed to fetch current user",
            error: error.message
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({ message: "Email address is required" });
        }

        const user = await User.findOne({
            where: { email: email.toLowerCase().trim() }
        });

        if (!user) {
            return res.status(404).json({ message: "No account found with this email address" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = otpExpires;
        user.isResetOtpVerified = false;
        await user.save();

        try {
            await transporter.sendMail({
                from: `"MultiVendor App" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: "Your Password Reset OTP - MultiVendor Marketplace",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
                        <h2 style="color: #2563eb; margin-top: 0; text-align: center;">Password Reset Verification</h2>
                        <p style="color: #334155; font-size: 15px;">Hello <strong>${user.name}</strong>,</p>
                        <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                            We received a request to reset your password. Use the verification code below to verify your identity and change your password:
                        </p>
                        <div style="background-color: #eff6ff; border: 2px dashed #3b82f6; border-radius: 8px; text-align: center; padding: 18px; margin: 25px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1d4ed8;">${otp}</span>
                        </div>
                        <p style="color: #64748b; font-size: 13px; text-align: center;">
                            ⏱️ This code will expire in <strong>10 minutes</strong>.
                        </p>
                        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                            If you did not request this password reset, please ignore this email or review your account security.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <p style="color: #94a3b8; font-size: 12px; text-align: center;">MultiVendor Marketplace Team</p>
                    </div>
                `,
                text: `Hello ${user.name},\n\nYour password reset verification code is: ${otp}\n\nThis OTP is valid for 10 minutes. If you did not request this, please ignore this email.`
            });
        } catch (mailError) {
            console.error("Failed to send OTP email:", mailError.message);
            return res.status(500).json({
                message: "Failed to send OTP email. Please ensure email service is properly configured.",
                error: mailError.message
            });
        }

        res.status(200).json({
            message: "Password reset OTP has been sent to your email successfully",
            email: user.email,
            expiresIn: "10 minutes"
        });

    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({
            message: "Failed to process forgot password request",
            error: error.message
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP code are required" });
        }

        const user = await User.findOne({
            where: { email: email.toLowerCase().trim() }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        if (!user.resetPasswordOtp) {
            return res.status(400).json({
                message: "No OTP was requested for this account. Please request a new OTP first."
            });
        }

        const now = new Date();
        if (now > new Date(user.resetPasswordOtpExpires)) {
            user.resetPasswordOtp = null;
            user.resetPasswordOtpExpires = null;
            user.isResetOtpVerified = false;
            await user.save();
            return res.status(400).json({
                message: "OTP code has expired. Please request a new one."
            });
        }

        if (user.resetPasswordOtp !== otp.toString().trim()) {
            return res.status(400).json({
                message: "Invalid OTP code. Please enter the correct code sent to your email."
            });
        }

        user.isResetOtpVerified = true;
        await user.save();

        const resetToken = generateToken({
            id: user.id,
            email: user.email,
            purpose: "password_reset"
        });

        res.status(200).json({
            message: "OTP verified successfully. You can now reset your password.",
            email: user.email,
            resetToken
        });

    } catch (error) {
        console.error("Error in verifyOtp:", error);
        res.status(500).json({
            message: "Failed to verify OTP",
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, resetToken, otp, newPassword, confirmPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long" });
        }

        if (confirmPassword && newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        let user = null;

        if (resetToken) {
            let decoded;
            try {
                decoded = verifyToken(resetToken);
            } catch (jwtErr) {
                return res.status(401).json({
                    message: "Invalid or expired reset token. Please verify OTP again."
                });
            }

            if (decoded.purpose !== "password_reset") {
                return res.status(400).json({ message: "Invalid reset token purpose" });
            }

            user = await User.findByPk(decoded.id);
        }

        else if (email) {
            user = await User.findOne({
                where: { email: email.toLowerCase().trim() }
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (otp) {
                if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp.toString().trim()) {
                    return res.status(400).json({ message: "Invalid OTP code" });
                }
                if (new Date() > new Date(user.resetPasswordOtpExpires)) {
                    return res.status(400).json({ message: "OTP has expired. Please request a new one." });
                }
            } else {
                if (!user.isResetOtpVerified) {
                    return res.status(400).json({
                        message: "Please verify the OTP sent to your email before resetting password."
                    });
                }
                if (new Date() > new Date(user.resetPasswordOtpExpires)) {
                    return res.status(400).json({
                        message: "Verification session expired. Please request a new OTP."
                    });
                }
            }
        } else {
            return res.status(400).json({
                message: "Either resetToken or email is required to reset password"
            });
        }

        if (!user) {
            return res.status(404).json({ message: "User account not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordOtp = null;
        user.resetPasswordOtpExpires = null;
        user.isResetOtpVerified = false;
        await user.save();

        try {
            await transporter.sendMail({
                from: `"MultiVendor App" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: "Security Alert: Password Changed Successfully",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
                        <h2 style="color: #16a34a; margin-top: 0; text-align: center;">Password Changed Successfully</h2>
                        <p style="color: #334155; font-size: 15px;">Hello <strong>${user.name}</strong>,</p>
                        <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                            Your password for your MultiVendor Marketplace account was changed successfully on <strong>${new Date().toLocaleString()}</strong>.
                        </p>
                        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
                            <p style="color: #15803d; font-size: 14px; margin: 0;">
                                You can now log in to your account with your new password.
                            </p>
                        </div>
                        <p style="color: #dc2626; font-size: 13px;">
                            ⚠️ If you did NOT perform this change, please contact our support team immediately to secure your account.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <p style="color: #94a3b8; font-size: 12px; text-align: center;">MultiVendor Marketplace Team</p>
                    </div>
                `,
                text: `Hello ${user.name},\n\nYour password for MultiVendor Marketplace was successfully updated on ${new Date().toLocaleString()}.\n\nIf you did not make this change, please contact support immediately.`
            });
        } catch (mailError) {
            console.error("Warning: Could not send password reset confirmation email:", mailError.message);
        }

        res.status(200).json({
            message: "Password has been reset successfully. You can now log in with your new password."
        });

    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({
            message: "Failed to reset password",
            error: error.message
        });
    }
};

const resendOtp = async (req, res) => {
    return forgotPassword(req, res);
};

module.exports = {
    register,
    login,
    getCurrentUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    resendOtp
};
