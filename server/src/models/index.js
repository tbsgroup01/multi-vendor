const User = require("./userModel");
const Vendor = require("./vendorModel");
const SubscriptionPlan = require("./subscriptionPlanModel");
const VendorSubscription = require("./vendorSubscriptionModel");
const Category = require("./categories");
const Product = require("./productModel");


SubscriptionPlan.hasMany(VendorSubscription, { foreignKey: "planId", as: "subscriptions" });
VendorSubscription.belongsTo(SubscriptionPlan, { foreignKey: "planId", as: "plan" });

Vendor.hasMany(VendorSubscription, { foreignKey: "vendorId", as: "subscriptions" });
VendorSubscription.belongsTo(Vendor, { foreignKey: "vendorId", as: "vendor" });


Vendor.hasMany(Product, { foreignKey: "vendorId", as: "products", onDelete: "CASCADE" });
Product.belongsTo(Vendor, { foreignKey: "vendorId", as: "vendor" });

Category.hasMany(Product, { foreignKey: "categoryId", as: "products", onDelete: "SET NULL" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

module.exports = {
    User,
    Vendor,
    SubscriptionPlan,
    VendorSubscription,
    Category,
    Product
};

