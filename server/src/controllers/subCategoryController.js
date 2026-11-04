const { Op } = require("sequelize");
const { SubCategory, Category, Product } = require("../models");

// 1. Create a new SubCategory (Admin only)
const createSubCategory = async (req, res) => {
    try {
        const { name, categoryId, image, description, isActive } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Subcategory name is required" });
        }

        if (!categoryId) {
            return res.status(400).json({ message: "Parent categoryId is required" });
        }

        // Verify parent category exists
        const parentCategory = await Category.findByPk(categoryId);
        if (!parentCategory) {
            return res.status(404).json({ message: "Parent category not found with provided categoryId" });
        }

        let imagePath = image || null;
        if (req.file) {
            imagePath = `/uploads/categories/${req.file.filename}`;
        }

        const subCategory = await SubCategory.create({
            name: name.trim(),
            categoryId,
            image: imagePath,
            description: description ? description.trim() : null,
            isActive: isActive !== undefined ? Boolean(isActive) : true
        });

        res.status(201).json({
            message: "SubCategory created successfully",
            subCategory: {
                ...subCategory.toJSON(),
                category: {
                    id: parentCategory.id,
                    name: parentCategory.name
                }
            }
        });
    } catch (error) {
        console.error("Error creating subcategory:", error);
        res.status(500).json({
            message: "Failed to create subcategory",
            error: error.message
        });
    }
};

// 2. Get all SubCategories (Public / Admin with filters)
const getAllSubCategories = async (req, res) => {
    try {
        const { categoryId, search, isActive } = req.query;
        const whereClause = {};

        if (categoryId) {
            whereClause.categoryId = categoryId;
        }

        if (isActive !== undefined) {
            whereClause.isActive = isActive === "true";
        }

        if (search) {
            whereClause.name = { [Op.like]: `%${search.trim()}%` };
        }

        const subCategories = await SubCategory.findAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "name", "image"]
                }
            ],
            order: [["name", "ASC"]]
        });

        res.status(200).json({
            count: subCategories.length,
            subCategories
        });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({
            message: "Failed to fetch subcategories",
            error: error.message
        });
    }
};

// 3. Get all SubCategories under a specific Category
const getSubCategoriesByCategoryId = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const subCategories = await SubCategory.findAll({
            where: { categoryId, isActive: true },
            order: [["name", "ASC"]]
        });

        res.status(200).json({
            category: {
                id: category.id,
                name: category.name
            },
            count: subCategories.length,
            subCategories
        });
    } catch (error) {
        console.error("Error fetching subcategories for category:", error);
        res.status(500).json({
            message: "Failed to fetch subcategories",
            error: error.message
        });
    }
};

// 4. Get single SubCategory by ID
const getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const subCategory = await SubCategory.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "name", "image", "description"]
                }
            ]
        });

        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        res.status(200).json({ subCategory });
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        res.status(500).json({
            message: "Failed to fetch subcategory",
            error: error.message
        });
    }
};

// 5. Update SubCategory (Admin only)
const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const subCategory = await SubCategory.findByPk(id);

        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        const { name, categoryId, image, description, isActive } = req.body;

        if (categoryId !== undefined && categoryId !== subCategory.categoryId) {
            const parentExists = await Category.findByPk(categoryId);
            if (!parentExists) {
                return res.status(404).json({ message: "Specified parent category does not exist" });
            }
            subCategory.categoryId = categoryId;
        }

        if (name !== undefined) subCategory.name = name.trim();
        if (req.file) {
            subCategory.image = `/uploads/categories/${req.file.filename}`;
        } else if (image !== undefined) {
            subCategory.image = image;
        }
        if (description !== undefined) subCategory.description = description ? description.trim() : null;
        if (isActive !== undefined) subCategory.isActive = Boolean(isActive);

        await subCategory.save();

        res.status(200).json({
            message: "SubCategory updated successfully",
            subCategory
        });
    } catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({
            message: "Failed to update subcategory",
            error: error.message
        });
    }
};

// 6. Delete SubCategory (Admin only)
const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const subCategory = await SubCategory.findByPk(id);

        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        await subCategory.destroy();

        res.status(200).json({
            message: "SubCategory deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        res.status(500).json({
            message: "Failed to delete subcategory",
            error: error.message
        });
    }
};

module.exports = {
    createSubCategory,
    getAllSubCategories,
    getSubCategoriesByCategoryId,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
};
