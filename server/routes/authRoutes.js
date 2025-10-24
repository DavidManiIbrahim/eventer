const express = require("express");
const router = express.Router();
const multer = require("multer");
const { register, login } = require("../controllers/authControllers");

// 🧩 Multer for form-data parsing (no file uploads yet)
const upload = multer();

// ✅ Register route
router.post("/register", upload.none(), register);

// ✅ Login route
router.post("/login", login);

module.exports = router;
