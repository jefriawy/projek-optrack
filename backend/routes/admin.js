// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const { createAdmin, createAkademik, createPM } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");

// Middleware untuk validasi input Admin
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

// Middleware untuk validasi input Akademik
const validateAkademikInput = [
  body("nmAkademik", "Akademik name is required").notEmpty(),
  body("emailAkademik", "Please include a valid email").isEmail(),
  body("password", "Password must be 6 or more characters").isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware untuk validasi input Project Manager
const validatePMInput = [
  body("nmPM", "Project Manager name is required").notEmpty(),
  body("emailPM", "Please include a valid email").isEmail(),
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

// Rute untuk membuat akun Akademik baru
router.post("/akademik", authMiddleware(["Admin"]), validateAkademikInput, createAkademik);

// Rute untuk membuat akun Project Manager baru
router.post("/pm", authMiddleware(["Admin"]), validatePMInput, createPM);

module.exports = router;
