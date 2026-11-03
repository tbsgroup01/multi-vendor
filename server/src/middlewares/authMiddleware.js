const { User, Vendor } = require("../models");
const { verifyToken } = require("../utils/jwt");

const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }


        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (err) {
            return res.status(401).json({ message: "Not authorized, invalid or expired token" });
        }

        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ["password"] },
            include: [{ model: Vendor, as: "vendorProfile" }]
        });

        if (!user) {
            return res.status(401).json({ message: "User not found, authorization denied" });
        }


        req.user = user;
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({ message: "Authorization server error", error: error.message });
    }
};


const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: role '${req.user?.role}' does not have permission to perform this action`
            });
        }
        next();
    };
};


const isApprovedVendor = (req, res, next) => {
    if (req.user?.role === "vendor") {
        if (!req.user.vendorProfile || req.user.vendorProfile.status !== "approved") {
            return res.status(403).json({
                message: "Access denied: Your vendor account is pending admin approval",
                vendorStatus: req.user.vendorProfile?.status || "pending"
            });
        }
    }
    next();
};

module.exports = { protect, restrictTo, isApprovedVendor };