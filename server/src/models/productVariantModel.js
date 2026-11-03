const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ProductVariant = sequelize.define("ProductVariant", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "e.g., Red / XL, or 128GB / 8GB RAM"
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    discountPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    attributes: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
        comment: "Key-value attributes e.g., { color: 'Red', size: 'XL' }"
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: "Variant-specific images array"
    },
    status: {
        type: DataTypes.ENUM("active", "inactive", "out_of_stock"),
        defaultValue: "active"
    }
}, {
    timestamps: true
});

module.exports = ProductVariant;

