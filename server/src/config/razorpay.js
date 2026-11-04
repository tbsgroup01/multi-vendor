const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from server directory as well as default cwd
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const createRazorpayInstance = (key_id, key_secret) => {
    const finalKeyId = key_id || process.env.RAZORPAY_KEY_ID;
    const finalKeySecret = key_secret || process.env.RAZORPAY_KEY_SECRET;

    if (!finalKeyId || !finalKeySecret) {
        return null;
    }

    return new Razorpay({
        key_id: finalKeyId,
        key_secret: finalKeySecret,
    });
};

const getRazorpayInstance = () => {
    return createRazorpayInstance();
};

module.exports = {
    createRazorpayInstance,
    getRazorpayInstance,
};
