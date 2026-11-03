const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false
});

// Clean duplicate indexes caused by MySQL/Sequelize index duplication
const cleanDuplicateIndexes = async (tableName) => {
    try {
        const [indexes] = await sequelize.query(`SHOW INDEX FROM \`${tableName}\` WHERE Key_name != 'PRIMARY'`);
        const columnKeys = {};

        for (const row of indexes) {
            const keyName = row.Key_name;
            const colName = row.Column_name;

            if (!columnKeys[colName]) {
                columnKeys[colName] = [];
            }
            if (!columnKeys[colName].includes(keyName)) {
                columnKeys[colName].push(keyName);
            }
        }

        let droppedCount = 0;
        for (const col of Object.keys(columnKeys)) {
            const keys = columnKeys[col];
            for (let i = 1; i < keys.length; i++) {
                try {
                    await sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`${keys[i]}\``);
                    droppedCount++;
                } catch (dropErr) {}
            }
        }

        if (droppedCount > 0) {
            console.log(`Cleaned up ${droppedCount} redundant indexes from ${tableName} table.`);
        }
    } catch (err) {}
};

// Ensure newly added columns exist in physical MySQL tables without risky alter:true
const ensureTableColumns = async () => {
    try {
        const checkAndAddColumn = async (tableName, columnName, columnDefinition) => {
            try {
                const [cols] = await sequelize.query(`SHOW COLUMNS FROM \`${tableName}\` LIKE '${columnName}'`);
                if (cols.length === 0) {
                    await sequelize.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${columnDefinition}`);
                    console.log(`[DB Migration] Added missing column '${columnName}' to '${tableName}'.`);
                }
            } catch (colErr) {
                // Ignore if table does not exist yet
            }
        };

        // VendorSubscriptions columns
        await checkAndAddColumn("VendorSubscriptions", "invoiceNumber", "VARCHAR(255) NULL");
        await checkAndAddColumn("VendorSubscriptions", "transactionId", "VARCHAR(255) NULL");
        await checkAndAddColumn("VendorSubscriptions", "paymentMethod", "VARCHAR(255) NULL DEFAULT 'mock_payment'");
        await checkAndAddColumn("VendorSubscriptions", "paymentStatus", "ENUM('pending', 'completed', 'failed') DEFAULT 'completed'");
        await checkAndAddColumn("VendorSubscriptions", "productLimit", "INT NOT NULL DEFAULT 10");
        await checkAndAddColumn("VendorSubscriptions", "pricePaid", "DECIMAL(10, 2) NOT NULL DEFAULT 0.00");
        await checkAndAddColumn("VendorSubscriptions", "status", "ENUM('active', 'expired', 'cancelled') DEFAULT 'active'");

        // SubscriptionPlans columns
        await checkAndAddColumn("SubscriptionPlans", "features", "JSON NULL");
        await checkAndAddColumn("SubscriptionPlans", "isActive", "TINYINT(1) DEFAULT 1");
        await checkAndAddColumn("SubscriptionPlans", "productLimit", "INT NOT NULL DEFAULT 10");
        await checkAndAddColumn("SubscriptionPlans", "durationInDays", "INT NOT NULL DEFAULT 30");

        // Users columns
        await checkAndAddColumn("Users", "isVerified", "TINYINT(1) DEFAULT 0");
        await checkAndAddColumn("Users", "resetPasswordOtp", "VARCHAR(255) NULL");
        await checkAndAddColumn("Users", "resetPasswordOtpExpires", "DATETIME NULL");
        await checkAndAddColumn("Users", "isResetOtpVerified", "TINYINT(1) DEFAULT 0");

        // Vendors columns
        await checkAndAddColumn("Vendors", "status", "ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'");
        await checkAndAddColumn("Vendors", "productsLimit", "INT DEFAULT 10");
        await checkAndAddColumn("Vendors", "commissionRate", "INT DEFAULT 10");

        // Products columns
        await checkAndAddColumn("Products", "subCategoryId", "INT NULL");
        await checkAndAddColumn("Products", "rating", "DECIMAL(10, 2) NULL DEFAULT 0.00");
        await checkAndAddColumn("Products", "reviewCount", "INT NULL DEFAULT 0");
        await checkAndAddColumn("Products", "isFeatured", "TINYINT(1) DEFAULT 0");
        await checkAndAddColumn("Products", "discountPrice", "DECIMAL(10, 2) NULL");
        await checkAndAddColumn("Products", "sku", "VARCHAR(255) NULL");
        await checkAndAddColumn("Products", "hasVariants", "TINYINT(1) DEFAULT 0");

        // CartItems & OrderItems columns for Variants
        await checkAndAddColumn("CartItems", "variantId", "INT NULL");
        await checkAndAddColumn("OrderItems", "variantId", "INT NULL");
        await checkAndAddColumn("OrderItems", "variantName", "VARCHAR(255) NULL");

        // Dynamic check across all models to ensure no column is ever missing
        const queryInterface = sequelize.getQueryInterface();
        const models = sequelize.models;
        for (const modelName of Object.keys(models)) {
            const model = models[modelName];
            const tableName = typeof model.getTableName === "function" ? model.getTableName() : modelName;

            let existingColumns = [];
            try {
                const [cols] = await sequelize.query(`SHOW COLUMNS FROM \`${tableName}\``);
                existingColumns = cols.map(c => c.Field);
            } catch (err) {
                continue;
            }

            const attributes = model.rawAttributes;
            for (const attrName of Object.keys(attributes)) {
                if (!existingColumns.includes(attrName)) {
                    try {
                        await queryInterface.addColumn(tableName, attrName, attributes[attrName]);
                        console.log(`[DB Migration] Added missing column '${attrName}' to '${tableName}'.`);
                    } catch (addErr) {}
                }
            }
        }
    } catch (err) {
        console.error("Column verification error:", err.message);
    }
};

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");

        // Clean redundant indexes
        await cleanDuplicateIndexes("Users");
        await cleanDuplicateIndexes("Vendors");
        await cleanDuplicateIndexes("VendorSubscriptions");
        await cleanDuplicateIndexes("SubscriptionPlans");
        await cleanDuplicateIndexes("Categories");
        await cleanDuplicateIndexes("SubCategories");
        await cleanDuplicateIndexes("Products");
        await cleanDuplicateIndexes("ProductVariants");
        await cleanDuplicateIndexes("CartItems");
        await cleanDuplicateIndexes("Orders");
        await cleanDuplicateIndexes("OrderItems");

        // Sync all models to create tables
        await sequelize.sync();
        console.log("Database models synchronized successfully.");

        // Ensure newly introduced columns exist in tables
        await ensureTableColumns();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

module.exports = { sequelize, connectDB };