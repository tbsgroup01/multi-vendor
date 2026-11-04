const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadBaseDir = path.join(__dirname, "../../uploads");
const productsUploadDir = path.join(uploadBaseDir, "products");
const variantsUploadDir = path.join(uploadBaseDir, "variants");
const categoriesUploadDir = path.join(uploadBaseDir, "categories");
const avatarsUploadDir = path.join(uploadBaseDir, "avatars");

[uploadBaseDir, productsUploadDir, variantsUploadDir, categoriesUploadDir, avatarsUploadDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const url = (req.baseUrl || "") + (req.originalUrl || "");
        if (file.fieldname && file.fieldname.toLowerCase().includes("variant")) {
            cb(null, variantsUploadDir);
        } else if (url.includes("categories") || (file.fieldname && file.fieldname.toLowerCase().includes("category"))) {
            cb(null, categoriesUploadDir);
        } else if (url.includes("profile") || (file.fieldname && file.fieldname.toLowerCase().includes("avatar"))) {
            cb(null, avatarsUploadDir);
        } else {
            cb(null, productsUploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        const url = (req.baseUrl || "") + (req.originalUrl || "");
        let prefix = "product";
        if (file.fieldname && file.fieldname.toLowerCase().includes("variant")) prefix = "variant";
        else if (url.includes("categories") || (file.fieldname && file.fieldname.toLowerCase().includes("category"))) prefix = "category";
        else if (url.includes("profile") || (file.fieldname && file.fieldname.toLowerCase().includes("avatar"))) prefix = "avatar";
        cb(null, `${prefix}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|webp|gif|svg/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    if (allowedExtensions.test(ext) && (mime.startsWith("image/") || allowedExtensions.test(mime))) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (.jpeg, .jpg, .png, .webp, .gif, .svg) are allowed!"), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter
});

module.exports = upload;
