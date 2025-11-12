// backend/routes/outsourcer.js
const express = require("express");
const router = express.Router();
const { createOutsourcerUser, getAllOutsourcers } = require("../controllers/outsourcerController");
const authMiddleware = require("../middleware/authMiddleware");
// GET /api/outsourcer - ambil semua outsourcer
router.get(
  "/",
  authMiddleware(["Admin", "HR"]),
  getAllOutsourcers
);
const { body, validationResult } = require("express-validator");

// Middleware untuk validasi input
const validateOutsourcerInput = [
  body("nmOutsourcer", "Outsourcer name is required").notEmpty(),
  body("emailOutsourcer", "Please include a valid email").isEmail(),
  body("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
  body("role", "Role is required and must be 'external' or 'internal'").isIn([
    "external",
    "internal",
  ]),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Rute untuk membuat outsourcer user baru
// POST /api/outsourcer
router.post(
  "/",
  authMiddleware(["Admin"]),
  validateOutsourcerInput,
  createOutsourcerUser
);

module.exports = router;
