// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const { createAdmin, createJudge } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");

// Middleware untuk validasi input
const validateAdminInput = [
  body("nmAdmin", "Admin name is required").notEmpty(),
  body("emailAdmin", "Please include a valid email").isEmail(),
  body("password", "Password must be 6 or more characters").isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Rute untuk membuat admin baru
// POST /api/admin
router.post("/", authMiddleware(["Admin"]), validateAdminInput, createAdmin);

module.exports = router;

