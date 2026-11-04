const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM("user", "vendor", "admin"),
        allowNull: false,
        defaultValue: "user"
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    resetPasswordOtp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordOtpExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isResetOtpVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = User;
