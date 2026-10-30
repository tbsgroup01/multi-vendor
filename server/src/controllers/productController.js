const { Op } = require("sequelize");
const { Product, Vendor, Category, VendorSubscription, SubscriptionPlan } = require("../models");

// 1. Create a Product on behalf of a verified vendor with active subscription quota
const createProduct = async (req, res) => {
    try {
        const {
            name,
            title,
            description,
            price,
            discountPrice,
            stock,
            sku,
            images,
            status,
            categoryId
        } = req.body;

        const productName = (name || title || "").trim();

        if (!productName) {
            return res.status(400).json({ message: "Product name is required" });
        }

        if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
            return res.status(400).json({ message: "A valid positive price is required" });
        }

        // 1. Verify Vendor Profile
        const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }

        // 2. Check if Vendor is approved by Admin
        if (vendor.status !== "approved") {
            return res.status(403).json({
                message: "Your vendor account is pending admin approval. You can only list products once approved by the admin.",
                vendorStatus: vendor.status
            });
        }

        // 3. Check for Active Subscription
        const activeSubscription = await VendorSubscription.findOne({
            where: {
                vendorId: vendor.id,
                status: "active"
            },
            include: [{ model: SubscriptionPlan, as: "plan" }]
        });

        if (!activeSubscription) {
            return res.status(403).json({
                message: "No active subscription plan found. Please purchase a subscription plan to list products.",
                needsSubscription: true
            });
        }

        // Check if subscription has expired
        const now = new Date();
        const expiryDate = new Date(activeSubscription.endDate);
        if (now > expiryDate) {
            activeSubscription.status = "expired";
            await activeSubscription.save();
            return res.status(403).json({
                message: "Your subscription plan has expired. Please renew or upgrade your plan to list new products.",
                expiredAt: activeSubscription.endDate,
                subscriptionExpired: true
            });
        }

        // 4. Check Product Listing Limit according to active plan
        const currentProductCount = await Product.count({ where: { vendorId: vendor.id } });
        const maxLimit = activeSubscription.productLimit;

        if (currentProductCount >= maxLimit) {
            return res.status(403).json({
                message: `Product listing limit reached! Your plan '${activeSubscription.plan?.name || "Active Plan"}' allows a maximum of ${maxLimit} products. You have already listed ${currentProductCount} products.`,
                planName: activeSubscription.plan?.name,
                currentCount: currentProductCount,
                productLimit: maxLimit,
                upgradeRequired: true
            });
        }

        // 5. Check Category if provided
        if (categoryId) {
            const categoryExists = await Category.findByPk(categoryId);
            if (!categoryExists) {
                return res.status(400).json({ message: "Specified category does not exist" });
            }
        }

        // 6. Create Product
        let parsedImages = [];
        if (Array.isArray(images)) {
            parsedImages = images;
        } else if (typeof images === "string" && images.trim()) {
            parsedImages = [images.trim()];
        }

        const product = await Product.create({
            vendorId: vendor.id,
            categoryId: categoryId || null,
            name: productName,
            description: description ? description.trim() : null,
            price: Number(price),
            discountPrice: discountPrice !== undefined && discountPrice !== null && !isNaN(Number(discountPrice)) ? Number(discountPrice) : null,
            stock: stock !== undefined && !isNaN(Number(stock)) ? Math.max(0, parseInt(stock, 10)) : 0,
            sku: sku ? sku.trim() : null,
            images: parsedImages,
            status: status || "active"
        });

        const newUsedSlots = currentProductCount + 1;
        const remainingSlots = Math.max(0, maxLimit - newUsedSlots);

        res.status(201).json({
            message: "Product listed successfully",
            product,
            quota: {
                planName: activeSubscription.plan?.name,
                totalLimit: maxLimit,
                usedSlots: newUsedSlots,
                remainingSlots,
                validUntil: activeSubscription.endDate
            }
        });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
};

// 2. Get all products of the logged-in vendor with current listing quota
const getMyProducts = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }

        const { status, search, page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
        const offset = (pageNum - 1) * limitNum;

        const whereClause = { vendorId: vendor.id };

        if (status) {
            whereClause.status = status;
        }

        if (search) {
            whereClause.name = { [Op.like]: `%${search.trim()}%` };
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "name", "image"]
                }
            ],
            order: [["createdAt", "DESC"]],
            limit: limitNum,
            offset
        });

        // Fetch active subscription for quota display
        const activeSubscription = await VendorSubscription.findOne({
            where: { vendorId: vendor.id, status: "active" },
            include: [{ model: SubscriptionPlan, as: "plan" }]
        });

        let quota = null;
        if (activeSubscription) {
            const totalProducts = await Product.count({ where: { vendorId: vendor.id } });
            quota = {
                hasActivePlan: true,
                planName: activeSubscription.plan?.name,
                totalLimit: activeSubscription.productLimit,
                usedSlots: totalProducts,
                remainingSlots: Math.max(0, activeSubscription.productLimit - totalProducts),
                validUntil: activeSubscription.endDate
            };
        } else {
            quota = {
                hasActivePlan: false,
                message: "No active plan. Please subscribe to list new items."
            };
        }

        res.status(200).json({
            count,
            page: pageNum,
            totalPages: Math.ceil(count / limitNum),
            quota,
            products
        });

    } catch (error) {
        console.error("Error fetching vendor products:", error);
        res.status(500).json({
            message: "Failed to fetch vendor products",
            error: error.message
        });
    }
};

// 3. Get all products (Public marketplace catalog)
const getAllProducts = async (req, res) => {
    try {
        const {
            search,
            categoryId,
            vendorId,
            minPrice,
            maxPrice,
            inStock,
            status,
            sortBy,
            page = 1,
            limit = 20
        } = req.query;

        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
        const offset = (pageNum - 1) * limitNum;

        const whereClause = {};

        // Default to active products for public catalog
        if (status) {
            whereClause.status = status;
        } else {
            whereClause.status = "active";
        }

        if (categoryId) {
            whereClause.categoryId = categoryId;
        }

        if (vendorId) {
            whereClause.vendorId = vendorId;
        }

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search.trim()}%` } },
                { description: { [Op.like]: `%${search.trim()}%` } }
            ];
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            whereClause.price = {};
            if (minPrice !== undefined) whereClause.price[Op.gte] = Number(minPrice);
            if (maxPrice !== undefined) whereClause.price[Op.lte] = Number(maxPrice);
        }

        if (inStock === "true") {
            whereClause.stock = { [Op.gt]: 0 };
        }

        // Sorting
        let order = [["createdAt", "DESC"]];
        if (sortBy === "price_asc") {
            order = [["price", "ASC"]];
        } else if (sortBy === "price_desc") {
            order = [["price", "DESC"]];
        } else if (sortBy === "oldest") {
            order = [["createdAt", "ASC"]];
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "name", "image"]
                },
                {
                    model: Vendor,
                    as: "vendor",
                    attributes: ["id", "storeName", "businessName", "category"]
                }
            ],
            order,
            limit: limitNum,
            offset
        });

        res.status(200).json({
            count,
            page: pageNum,
            totalPages: Math.ceil(count / limitNum),
            products
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
};

// 4. Get single product by ID (Public)
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "name", "image", "description"]
                },
                {
                    model: Vendor,
                    as: "vendor",
                    attributes: ["id", "storeName", "businessName", "category", "status"]
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ product });

    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
};

// 5. Update Product (Vendor owner or Admin)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Ownership check: If vendor, must be owner
        if (req.user.role === "vendor") {
            const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
            if (!vendor || product.vendorId !== vendor.id) {
                return res.status(403).json({ message: "Access denied: You can only edit your own products" });
            }
        } else if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const {
            name,
            title,
            description,
            price,
            discountPrice,
            stock,
            sku,
            images,
            status,
            categoryId
        } = req.body;

        if (name !== undefined || title !== undefined) product.name = (name || title).trim();
        if (description !== undefined) product.description = description ? description.trim() : null;
        if (price !== undefined && !isNaN(Number(price))) product.price = Number(price);
        if (discountPrice !== undefined) product.discountPrice = discountPrice !== null && !isNaN(Number(discountPrice)) ? Number(discountPrice) : null;
        if (stock !== undefined && !isNaN(Number(stock))) product.stock = Math.max(0, parseInt(stock, 10));
        if (sku !== undefined) product.sku = sku ? sku.trim() : null;
        if (status !== undefined) product.status = status;

        if (images !== undefined) {
            if (Array.isArray(images)) {
                product.images = images;
            } else if (typeof images === "string" && images.trim()) {
                product.images = [images.trim()];
            }
        }

        if (categoryId !== undefined) {
            if (categoryId) {
                const categoryExists = await Category.findByPk(categoryId);
                if (!categoryExists) {
                    return res.status(400).json({ message: "Specified category does not exist" });
                }
            }
            product.categoryId = categoryId || null;
        }

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};

// 6. Delete Product (Vendor owner or Admin) - Frees up slot in vendor's quota
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let vendor = null;
        if (req.user.role === "vendor") {
            vendor = await Vendor.findOne({ where: { userId: req.user.id } });
            if (!vendor || product.vendorId !== vendor.id) {
                return res.status(403).json({ message: "Access denied: You can only delete your own products" });
            }
        } else if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const vendorId = product.vendorId;
        await product.destroy();

        // Calculate freed up slots
        const remainingCount = await Product.count({ where: { vendorId } });

        res.status(200).json({
            message: "Product deleted successfully",
            freedSlot: true,
            currentProductsListed: remainingCount
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getMyProducts,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
