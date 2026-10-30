const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { User, Vendor } = require("../models");
const transporter = require("../config/mail");
const { generateToken } = require("../utils/jwt");

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
        const userPhone = (phone || phoneNumber || "").trim();
        const userRole = role === "vendor" ? "vendor" : role === "admin" ? "admin" : "user";

        // Basic validation required for all roles
        if (!userName || !userEmail || !userPhone || !password) {
            return res.status(400).json({
                message: "Full Name, Email, Phone Number, and Password are required"
            });
        }

        // Additional validation specific to Vendor
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

        // Check if user already exists by email
        const userExists = await User.findOne({ where: { email: userEmail } });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Check if user already exists by phone
        const phoneExists = await User.findOne({ where: { phone: userPhone } });
        if (phoneExists) {
            return res.status(400).json({ message: "User with this phone number already exists" });
        }

        // Check if vendor GST is already registered
        if (userRole === "vendor") {
            const gstExists = await Vendor.findOne({ where: { gstNumber: vendorGstNumber } });
            if (gstExists) {
                return res.status(400).json({ message: "GST Number is already registered" });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Vendors start unverified until admin approves; customers and admins start verified
        const isVerified = userRole === "vendor" ? false : true;

        // Create User account
        const user = await User.create({
            name: userName,
            email: userEmail,
            phone: userPhone,
            password: hashedPassword,
            role: userRole,
            isVerified: isVerified
        });

        // If Vendor, create Vendor profile with pending status
        let vendorProfile = null;
        if (userRole === "vendor") {
            vendorProfile = await Vendor.create({
                userId: user.id,
                businessName: vendorBusinessName,
                storeName: vendorStoreName,
                gstNumber: vendorGstNumber,
                category: vendorCategory,
                status: "pending"
            });
        }

        // Send welcome email (fail-safe)
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

        // Generate JWT token (only for verified users; vendors receive token once approved by admin)
        const token = isVerified ? generateToken({ id: user.id, role: user.role }) : null;

        // Prepare response without password
        const userData = user.toJSON();
        delete userData.password;
        if (vendorProfile) {
            userData.vendorProfile = vendorProfile;
        }

        const successMessage = userRole === "vendor"
            ? "Vendor registered successfully and is pending admin approval"
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

// Universal login for Customer, Vendor, and Admin (supports Email OR Phone)
const login = async (req, res) => {
    try {
        const { email, phone, emailOrPhone, identifier, password } = req.body;
        const loginIdentifier = (email || phone || emailOrPhone || identifier || "").trim();

        if (!loginIdentifier || !password) {
            return res.status(400).json({
                message: "Email or phone number, and password are required"
            });
        }

        // Find user by either email OR phone
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

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Check verification status
        if (user.isVerified === false) {
            const message = user.role === "vendor"
                ? "Your vendor account is pending admin approval. You will be able to log in once approved."
                : "User account is not verified";
            return res.status(401).json({ message, isVerified: false });
        }

        // Generate JWT token
        const token = generateToken({ id: user.id, role: user.role });

        // Prepare sanitized user response
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

// Get current authenticated user profile
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

module.exports = {
    register,
    login,
    getCurrentUser
};
