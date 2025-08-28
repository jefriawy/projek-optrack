// backend/routes/sales.js
const express = require("express");
const router = express.Router();
const { getSalesData, createSalesUser } = require("../controllers/salesController");
const authMiddleware = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");

// Middleware untuk validasi input
const validateSalesInput = [
  body("nmSales", "Sales name is required").notEmpty(),
  body("emailSales", "Please include a valid email").isEmail(),
  body("password", "Password must be 6 or more characters").isLength({ min: 6 }),
  body("role", "Role is required and must be 'Sales' or 'Head Sales'").isIn(['Sales', 'Head Sales']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Rute untuk mendapatkan data sales (laporan)
// GET /api/sales
router.get("/", authMiddleware(["Admin", "Head Sales"]), getSalesData);

// Rute untuk membuat sales user baru
// POST /api/sales
router.post("/", authMiddleware(["Admin"]), validateSalesInput, createSalesUser);

module.exports = router;