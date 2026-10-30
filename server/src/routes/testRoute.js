const express = require("express");
const router = express.Router();
const { sendEmail } = require("../controllers/testController");

router.post("/send-email", sendEmail);

module.exports = router;