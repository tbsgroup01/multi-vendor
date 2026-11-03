const User = require("./userModel");
const Vendor = require("./vendorModel");
const SubscriptionPlan = require("./subscriptionPlanModel");
const VendorSubscription = require("./vendorSubscriptionModel");
const Category = require("./categories");
const SubCategory = require("./subCategoryModel");
const Product = require("./productModel");
const ProductVariant = require("./productVariantModel");
const CartItem = require("./cartItemModel");
const Order = require("./orderModel");
const OrderItem = require("./orderItemModel");


SubscriptionPlan.hasMany(VendorSubscription, { foreignKey: "planId", as: "subscriptions" });
VendorSubscription.belongsTo(SubscriptionPlan, { foreignKey: "planId", as: "plan" });

Vendor.hasMany(VendorSubscription, { foreignKey: "vendorId", as: "subscriptions" });
VendorSubscription.belongsTo(Vendor, { foreignKey: "vendorId", as: "vendor" });


Vendor.hasMany(Product, { foreignKey: "vendorId", as: "products", onDelete: "CASCADE" });
Product.belongsTo(Vendor, { foreignKey: "vendorId", as: "vendor" });

Category.hasMany(Product, { foreignKey: "categoryId", as: "products", onDelete: "SET NULL" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Associations between Category, SubCategory, and Product
Category.hasMany(SubCategory, { foreignKey: "categoryId", as: "subCategories", onDelete: "CASCADE" });
SubCategory.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

SubCategory.hasMany(Product, { foreignKey: "subCategoryId", as: "products", onDelete: "SET NULL" });
Product.belongsTo(SubCategory, { foreignKey: "subCategoryId", as: "subCategory" });

// Associations for Product Variants
Product.hasMany(ProductVariant, { foreignKey: "productId", as: "variants", onDelete: "CASCADE" });
ProductVariant.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Associations for Cart & Checkout
User.hasMany(CartItem, { foreignKey: "userId", as: "cartItems", onDelete: "CASCADE" });
CartItem.belongsTo(User, { foreignKey: "userId", as: "user" });

Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

ProductVariant.hasMany(CartItem, { foreignKey: "variantId", as: "cartItems", onDelete: "SET NULL" });
CartItem.belongsTo(ProductVariant, { foreignKey: "variantId", as: "variant" });

// Associations for Orders & OrderItems
User.hasMany(Order, { foreignKey: "userId", as: "orders", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems", onDelete: "SET NULL" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

ProductVariant.hasMany(OrderItem, { foreignKey: "variantId", as: "orderItems", onDelete: "SET NULL" });
OrderItem.belongsTo(ProductVariant, { foreignKey: "variantId", as: "variant" });

Vendor.hasMany(OrderItem, { foreignKey: "vendorId", as: "vendorOrderItems", onDelete: "SET NULL" });
OrderItem.belongsTo(Vendor, { foreignKey: "vendorId", as: "vendor" });

module.exports = {
    User,
    Vendor,
    SubscriptionPlan,
    VendorSubscription,
    Category,
    SubCategory,
    Product,
    ProductVariant,
    CartItem,
    Order,
    OrderItem
};
