const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const uploadBaseDir = path.join(__dirname, "../../uploads");
const productsUploadDir = path.join(uploadBaseDir, "products");
const variantsUploadDir = path.join(uploadBaseDir, "variants");

[uploadBaseDir, productsUploadDir, variantsUploadDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage engine configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // If fieldname indicates variant, save into variants folder, otherwise products folder
        if (file.fieldname && file.fieldname.toLowerCase().includes("variant")) {
            cb(null, variantsUploadDir);
        } else {
            cb(null, productsUploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        const prefix = file.fieldname && file.fieldname.toLowerCase().includes("variant") ? "variant" : "product";
        cb(null, `${prefix}-${uniqueSuffix}${ext}`);
    }
});

// File filter (Only accept valid image formats)
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|webp|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    if (allowedExtensions.test(ext) && (mime.startsWith("image/") || allowedExtensions.test(mime))) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (.jpeg, .jpg, .png, .webp, .gif) are allowed!"), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max per file
    },
    fileFilter
});

module.exports = upload;

