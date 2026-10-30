const dotenv = require("dotenv");
dotenv.config();
const transporter = require("../config/mail");

const sendEmail = async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;

        if (!to) {
            return res.status(400).json({ message: "Recipient email ('to') is required in request body" });
        }

        const info = await transporter.sendMail({
            from: `"MultiVendor App" <${process.env.EMAIL_USER}>`,
            to,
            subject: subject || "Test Email",
            text: text || "This is a test email.",
            html: html || undefined
        });

        res.status(200).json({
            message: "Email sent successfully",
            messageId: info.messageId
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            message: "Failed to send email",
            error: error.message
        });
    }
};

module.exports = { sendEmail };