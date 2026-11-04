const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const SubscriptionPlan = sequelize.define("SubscriptionPlan", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tierKey: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    badge: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    monthlyPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    annualPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    popular: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    colorTheme: {
        type: DataTypes.STRING,
        defaultValue: "slate"
    },
    productLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50
    },
    durationInDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30
    },
    features: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = SubscriptionPlan;
