const { Op } = require("sequelize");
const { Product, ProductVariant, Vendor, Category, SubCategory, VendorSubscription, SubscriptionPlan } = require("../models");

// Helper: normalize image array from strings or arrays
const normalizeImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) {
        return images.map(img => (typeof img === "string" ? img.trim() : "")).filter(Boolean);
    }
    if (typeof images === "string") {
        try {
            const parsed = JSON.parse(images);
            if (Array.isArray(parsed)) return parsed.map(img => String(img).trim()).filter(Boolean);
        } catch (e) {
            // Not a JSON array, treat as single or comma-separated string
            return images.split(",").map(img => img.trim()).filter(Boolean);
        }
    }
    return [];
};

// 0. Dedicated Upload Controller for Product & Variant Images
const uploadProductImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No image files were uploaded" });
        }

        const uploadedFiles = req.files.map((file) => {
            const isVariant = file.fieldname && file.fieldname.toLowerCase().includes("variant");
            const subDir = isVariant ? "variants" : "products";
            const relativePath = `/uploads/${subDir}/${file.filename}`;
            const fullUrl = `${req.protocol}://${req.get("host")}${relativePath}`;

            return {
                fieldname: file.fieldname,
                filename: file.filename,
                path: relativePath,
                url: fullUrl,
                size: file.size,
                mimetype: file.mimetype
            };
        });

        res.status(200).json({
            message: "Images uploaded successfully",
            files: uploadedFiles,
            urls: uploadedFiles.map(f => f.path)
        });
    } catch (error) {
        console.error("Error in uploadProductImages:", error);
        res.status(500).json({
            message: "Failed to upload images",
            error: error.message
        });
    }
};

// 1. Create a Product (With or Without Variants & Variant Images)
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
            categoryId,
            subCategoryId,
            hasVariants
        } = req.body;

        const productName = (name || title || "").trim();

        if (!productName) {
            return res.status(400).json({ message: "Product name is required" });
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

        // 5. Check Category and SubCategory if provided
        let targetCategoryId = categoryId ? Number(categoryId) : null;
        let targetSubCategoryId = subCategoryId ? Number(subCategoryId) : null;

        if (targetSubCategoryId) {
            const subCategoryExists = await SubCategory.findByPk(targetSubCategoryId);
            if (!subCategoryExists) {
                return res.status(400).json({ message: "Specified subcategory does not exist" });
            }

            if (!targetCategoryId) {
                targetCategoryId = subCategoryExists.categoryId;
            } else if (targetCategoryId !== subCategoryExists.categoryId) {
                return res.status(400).json({
                    message: "The specified subcategory does not belong to the selected category"
                });
            }
        }

        if (targetCategoryId) {
            const categoryExists = await Category.findByPk(targetCategoryId);
            if (!categoryExists) {
                return res.status(400).json({ message: "Specified category does not exist" });
            }
        }

        // 6. Process Uploaded Files if multipart request
        let uploadedProductImages = [];
        const variantFilesMap = {}; // index or name -> array of relative image paths

        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const subDir = file.fieldname && file.fieldname.toLowerCase().includes("variant") ? "variants" : "products";
                const filePath = `/uploads/${subDir}/${file.filename}`;

                // Check if file is variant image: e.g. variantImages_0, variant_0_images, variantImages[0]
                const match = file.fieldname.match(/variant[^\d]*(\d+)/i);
                if (match) {
                    const vIdx = parseInt(match[1], 10);
                    if (!variantFilesMap[vIdx]) variantFilesMap[vIdx] = [];
                    variantFilesMap[vIdx].push(filePath);
                } else if (file.fieldname.toLowerCase().includes("variant")) {
                    // Generic variant image without index
                    if (!variantFilesMap["default"]) variantFilesMap["default"] = [];
                    variantFilesMap["default"].push(filePath);
                } else {
                    uploadedProductImages.push(filePath);
                }
            }
        }

        // Combine base product images
        let baseImages = [...normalizeImages(images), ...uploadedProductImages];

        // 7. Parse & Validate Variants
        let parsedVariants = [];
        let isVariantProduct = hasVariants === true || hasVariants === "true";

        if (req.body.variants) {
            if (typeof req.body.variants === "string") {
                try {
                    parsedVariants = JSON.parse(req.body.variants);
                } catch (e) {
                    return res.status(400).json({ message: "Invalid JSON format for variants" });
                }
            } else if (Array.isArray(req.body.variants)) {
                parsedVariants = req.body.variants;
            }
        }

        if (parsedVariants.length > 0) {
            isVariantProduct = true;
        }

        // Validate variants if enabled
        if (isVariantProduct) {
            if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
                return res.status(400).json({
                    message: "At least one variant must be defined when variant mode is enabled"
                });
            }

            for (let i = 0; i < parsedVariants.length; i++) {
                const v = parsedVariants[i];
                const vName = (v.name || v.title || "").trim();
                if (!vName) {
                    return res.status(400).json({
                        message: `Variant at index ${i} is missing a name (e.g., 'Red / XL' or '128GB')`
                    });
                }

                if (v.price === undefined || v.price === null || isNaN(Number(v.price)) || Number(v.price) < 0) {
                    return res.status(400).json({
                        message: `Variant '${vName}' requires a valid non-negative price`
                    });
                }

                // Associate any uploaded variant files for this index
                const attachedFiles = variantFilesMap[i] || [];
                const explicitImages = normalizeImages(v.images);
                v.parsedImages = [...explicitImages, ...attachedFiles];
            }
        }

        // Calculate default Price & Stock
        let finalPrice = Number(price);
        let finalStock = stock !== undefined && !isNaN(Number(stock)) ? Math.max(0, parseInt(stock, 10)) : 0;

        if (isVariantProduct) {
            const variantPrices = parsedVariants.map(v => Number(v.price));
            const variantStockSum = parsedVariants.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0);

            // If base price wasn't specified, use lowest variant price
            if (isNaN(finalPrice) || finalPrice <= 0) {
                finalPrice = Math.min(...variantPrices);
            }

            // If base stock wasn't explicitly specified, use total variant stock
            if (finalStock === 0) {
                finalStock = variantStockSum;
            }

            // If base images are empty, populate with first image of each variant
            if (baseImages.length === 0) {
                for (const v of parsedVariants) {
                    if (v.parsedImages && v.parsedImages.length > 0) {
                        baseImages.push(v.parsedImages[0]);
                    }
                }
            }
        } else {
            if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
                return res.status(400).json({ message: "A valid positive price is required for simple products" });
            }
        }

        // 8. Create Master Product
        const product = await Product.create({
            vendorId: vendor.id,
            categoryId: targetCategoryId,
            subCategoryId: targetSubCategoryId,
            name: productName,
            description: description ? description.trim() : null,
            price: finalPrice,
            discountPrice: discountPrice !== undefined && discountPrice !== null && !isNaN(Number(discountPrice)) ? Number(discountPrice) : null,
            stock: finalStock,
            sku: sku ? sku.trim() : null,
            images: baseImages,
            hasVariants: isVariantProduct,
            status: status || "active"
        });

        // 9. Create Variant Records
        let createdVariants = [];
        if (isVariantProduct && parsedVariants.length > 0) {
            const variantRecords = parsedVariants.map((v) => ({
                productId: product.id,
                name: (v.name || v.title).trim(),
                sku: v.sku ? v.sku.trim() : `${product.id}-${(v.name || "").replace(/\s+/g, "-").toUpperCase()}`,
                price: Number(v.price),
                discountPrice: v.discountPrice !== undefined && v.discountPrice !== null && !isNaN(Number(v.discountPrice)) ? Number(v.discountPrice) : null,
                stock: v.stock !== undefined && !isNaN(Number(v.stock)) ? Math.max(0, parseInt(v.stock, 10)) : 0,
                attributes: typeof v.attributes === "object" && v.attributes !== null ? v.attributes : {},
                images: v.parsedImages || [],
                status: v.status || "active"
            }));

            createdVariants = await ProductVariant.bulkCreate(variantRecords);
        }

        const newUsedSlots = currentProductCount + 1;
        const remainingSlots = Math.max(0, maxLimit - newUsedSlots);

        // Fetch complete product with variants for response
        const completeProduct = await Product.findByPk(product.id, {
            include: [
                { model: ProductVariant, as: "variants" },
                { model: Category, as: "category", attributes: ["id", "name", "image"] },
                { model: SubCategory, as: "subCategory", attributes: ["id", "name", "image"] }
            ]
        });

        res.status(201).json({
            message: isVariantProduct
                ? `Product '${productName}' listed successfully with ${createdVariants.length} variant(s)!`
                : "Product listed successfully",
            product: completeProduct,
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
                },
                {
                    model: SubCategory,
                    as: "subCategory",
                    attributes: ["id", "name", "image"]
                },
                {
                    model: ProductVariant,
                    as: "variants"
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

// 3. Get all products (Public marketplace catalog with variant details)
const getAllProducts = async (req, res) => {
    try {
        const {
            search,
            categoryId,
            subCategoryId,
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

        if (subCategoryId) {
            whereClause.subCategoryId = subCategoryId;
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
                    model: SubCategory,
                    as: "subCategory",
                    attributes: ["id", "name", "image"]
                },
                {
                    model: Vendor,
                    as: "vendor",
                    attributes: ["id", "storeName", "businessName", "category"]
                },
                {
                    model: ProductVariant,
                    as: "variants"
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

// 4. Get single product by ID (Public with variants & variant images)
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
                    model: SubCategory,
                    as: "subCategory",
                    attributes: ["id", "name", "image", "description"]
                },
                {
                    model: Vendor,
                    as: "vendor",
                    attributes: ["id", "storeName", "businessName", "category", "status"]
                },
                {
                    model: ProductVariant,
                    as: "variants"
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

// 5. Update Product & Variants (Vendor owner or Admin)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [{ model: ProductVariant, as: "variants" }]
        });

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
            categoryId,
            subCategoryId,
            hasVariants,
            variants
        } = req.body;

        if (name !== undefined || title !== undefined) product.name = (name || title).trim();
        if (description !== undefined) product.description = description ? description.trim() : null;
        if (price !== undefined && !isNaN(Number(price))) product.price = Number(price);
        if (discountPrice !== undefined) product.discountPrice = discountPrice !== null && !isNaN(Number(discountPrice)) ? Number(discountPrice) : null;
        if (stock !== undefined && !isNaN(Number(stock))) product.stock = Math.max(0, parseInt(stock, 10));
        if (sku !== undefined) product.sku = sku ? sku.trim() : null;
        if (status !== undefined) product.status = status;
        if (hasVariants !== undefined) product.hasVariants = hasVariants === true || hasVariants === "true";

        if (images !== undefined) {
            product.images = normalizeImages(images);
        }

        // Process any uploaded files
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const newUploadedImages = req.files
                .filter(f => !f.fieldname || !f.fieldname.toLowerCase().includes("variant"))
                .map(f => `/uploads/products/${f.filename}`);

            if (newUploadedImages.length > 0) {
                product.images = [...(product.images || []), ...newUploadedImages];
            }
        }

        if (subCategoryId !== undefined) {
            if (subCategoryId) {
                const subCategoryExists = await SubCategory.findByPk(subCategoryId);
                if (!subCategoryExists) {
                    return res.status(400).json({ message: "Specified subcategory does not exist" });
                }
                product.subCategoryId = Number(subCategoryId);

                if (categoryId !== undefined && categoryId && Number(categoryId) !== subCategoryExists.categoryId) {
                    return res.status(400).json({
                        message: "The specified subcategory does not belong to the selected category"
                    });
                } else if (!categoryId) {
                    product.categoryId = subCategoryExists.categoryId;
                }
            } else {
                product.subCategoryId = null;
            }
        }

        if (categoryId !== undefined) {
            if (categoryId) {
                const categoryExists = await Category.findByPk(categoryId);
                if (!categoryExists) {
                    return res.status(400).json({ message: "Specified category does not exist" });
                }
                product.categoryId = Number(categoryId);
            } else {
                product.categoryId = null;
            }
        }

        // Handle Variants update if provided
        if (variants !== undefined) {
            let parsedVariants = [];
            if (typeof variants === "string") {
                try {
                    parsedVariants = JSON.parse(variants);
                } catch (e) {
                    return res.status(400).json({ message: "Invalid JSON format for variants" });
                }
            } else if (Array.isArray(variants)) {
                parsedVariants = variants;
            }

            if (parsedVariants.length > 0) {
                product.hasVariants = true;
                // Delete existing variants and re-create fresh updated set
                await ProductVariant.destroy({ where: { productId: product.id } });

                const variantRecords = parsedVariants.map((v) => ({
                    productId: product.id,
                    name: (v.name || v.title).trim(),
                    sku: v.sku ? v.sku.trim() : `${product.id}-${(v.name || "").replace(/\s+/g, "-").toUpperCase()}`,
                    price: Number(v.price) || 0,
                    discountPrice: v.discountPrice !== undefined && v.discountPrice !== null && !isNaN(Number(v.discountPrice)) ? Number(v.discountPrice) : null,
                    stock: v.stock !== undefined && !isNaN(Number(v.stock)) ? Math.max(0, parseInt(v.stock, 10)) : 0,
                    attributes: typeof v.attributes === "object" && v.attributes !== null ? v.attributes : {},
                    images: normalizeImages(v.images),
                    status: v.status || "active"
                }));

                await ProductVariant.bulkCreate(variantRecords);
            }
        }

        await product.save();

        const updated = await Product.findByPk(product.id, {
            include: [
                { model: ProductVariant, as: "variants" },
                { model: Category, as: "category" },
                { model: SubCategory, as: "subCategory" }
            ]
        });

        res.status(200).json({
            message: "Product updated successfully",
            product: updated
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
    uploadProductImages,
    createProduct,
    getMyProducts,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
