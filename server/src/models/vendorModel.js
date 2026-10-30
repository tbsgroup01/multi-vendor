const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./userModel");

const Vendor = sequelize.define("Vendor", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: User,
            key: "id"
        }
    },
    businessName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    storeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gstNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "approved"
    }
});

// Associations
User.hasOne(Vendor, { foreignKey: "userId", as: "vendorProfile", onDelete: "CASCADE" });
Vendor.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = Vendor;
