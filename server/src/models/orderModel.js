const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    subTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    taxAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    shippingAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    shippingAddress: {
        type: DataTypes.JSON,
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING(50),
        defaultValue: "cod"
    },
    paymentStatus: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending"
    },
    orderStatus: {
        type: DataTypes.ENUM("placed", "processing", "shipped", "delivered", "cancelled"),
        defaultValue: "placed"
    },
    razorpayOrderId: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    razorpayPaymentId: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    razorpaySignature: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Order;
