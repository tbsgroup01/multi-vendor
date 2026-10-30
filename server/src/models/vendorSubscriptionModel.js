const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const VendorSubscription = sequelize.define("VendorSubscription", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    vendorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },

    transactionId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    pricePaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    productLimit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("active", "expired", "cancelled"),
        defaultValue: "active"
    },
    paymentStatus: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "completed"
    },
    paymentMethod: {
        type: DataTypes.STRING,
        defaultValue: "mock_payment"
    }
}, {
    timestamps: true
});

module.exports = VendorSubscription;
