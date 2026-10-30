const express = require("express");
const router = express.Router();

const { register, login, getCurrentUser } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/register/vendor", (req, res, next) => {
    req.body.role = "vendor";
    register(req, res, next);
});
router.post("/login", login);
router.get("/me", protect, getCurrentUser);


module.exports = router;