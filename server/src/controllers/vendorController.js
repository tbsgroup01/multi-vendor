const { Vendor, User } = require("../models");
const transporter = require("../config/mail");

// Get all vendors (with optional status filter: ?status=pending)
const getAllVendors = async (req, res) => {
    try {
        const { status } = req.query;
        const whereClause = {};

        if (status) {
            whereClause.status = status.toLowerCase();
        }

        const vendors = await Vendor.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone", "role", "isVerified", "createdAt"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            count: vendors.length,
            vendors
        });
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({
            message: "Failed to fetch vendors",
            error: error.message
        });
    }
};

// Get single vendor by ID
const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await Vendor.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone", "role", "isVerified", "createdAt"]
                }
            ]
        });

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        // Only admin or the vendor themselves can view this profile
        if (req.user.role !== "admin" && req.user.id !== vendor.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({ vendor });
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({
            message: "Failed to fetch vendor",
            error: error.message
        });
    }
};

// Admin approve vendor
const approveVendor = async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await Vendor.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ]
        });

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (vendor.status === "approved") {
            return res.status(400).json({ message: "Vendor is already approved" });
        }

        vendor.status = "approved";
        await vendor.save();

        // Mark associated user account as verified
        await User.update({ isVerified: true }, { where: { id: vendor.userId } });

        // Send approval notification email to vendor
        if (vendor.user && vendor.user.email) {
            try {
                await transporter.sendMail({
                    from: `"MultiVendor App" <${process.env.EMAIL_USER}>`,
                    to: vendor.user.email,
                    subject: "Your Vendor Account Has Been Approved! 🎉",
                    text: `Hello ${vendor.user.name},\n\nCongratulations! Your vendor store '${vendor.storeName}' has been approved by the admin.\n\nYou can now log in to your vendor dashboard, list products, and start selling!\n\nBest regards,\nMultiVendor Team`
                });
            } catch (mailError) {
                console.error("Warning: Failed to send vendor approval email:", mailError.message);
            }
        }

        res.status(200).json({
            message: "Vendor approved successfully",
            vendor
        });
    } catch (error) {
        console.error("Error approving vendor:", error);
        res.status(500).json({
            message: "Failed to approve vendor",
            error: error.message
        });
    }
};

// Admin reject vendor
const rejectVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body || {};

        const vendor = await Vendor.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ]
        });

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.status = "rejected";
        await vendor.save();

        // Mark associated user account as unverified
        await User.update({ isVerified: false }, { where: { id: vendor.userId } });

        // Send rejection notification email to vendor
        if (vendor.user && vendor.user.email) {
            try {
                const reasonText = reason ? `\nReason: ${reason}\n` : "";
                await transporter.sendMail({
                    from: `"MultiVendor App" <${process.env.EMAIL_USER}>`,
                    to: vendor.user.email,
                    subject: "MultiVendor App - Vendor Application Update",
                    text: `Hello ${vendor.user.name},\n\nWe regret to inform you that your vendor application for '${vendor.storeName}' has been rejected by our admin team.${reasonText}\nIf you have any questions, please contact our support team.\n\nBest regards,\nMultiVendor Team`
                });
            } catch (mailError) {
                console.error("Warning: Failed to send vendor rejection email:", mailError.message);
            }
        }

        res.status(200).json({
            message: "Vendor application rejected",
            vendor
        });
    } catch (error) {
        console.error("Error rejecting vendor:", error);
        res.status(500).json({
            message: "Failed to reject vendor",
            error: error.message
        });
    }
};

// Admin update status (approved, rejected, or pending)
const updateVendorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body || {};


        if (!status || !["pending", "approved", "rejected"].includes(status.toLowerCase())) {
            return res.status(400).json({
                message: "Status is required and must be 'pending', 'approved', or 'rejected'"
            });
        }

        if (status.toLowerCase() === "approved") {
            return approveVendor(req, res);
        } else if (status.toLowerCase() === "rejected") {
            return rejectVendor(req, res);
        }

        const vendor = await Vendor.findByPk(id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.status = "pending";
        await vendor.save();

        // Ensure user account is unverified while pending
        await User.update({ isVerified: false }, { where: { id: vendor.userId } });

        res.status(200).json({
            message: "Vendor status updated to pending",
            vendor
        });
    } catch (error) {
        console.error("Error updating vendor status:", error);
        res.status(500).json({
            message: "Failed to update vendor status",
            error: error.message
        });
    }
};

// Admin delete vendor
const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findByPk(id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        await vendor.destroy();
        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        console.error("Error deleting vendor:", error);
        res.status(500).json({
            message: "Failed to delete vendor",
            error: error.message
        });
    }
};

module.exports = {
    getAllVendors,
    getVendorById,
    approveVendor,
    rejectVendor,
    updateVendorStatus,
    deleteVendor
};
