// backend/routes/expert.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getExperts, createExpertUser, getMyDashboardData } = require("../controllers/expertController");
const { body, validationResult } = require("express-validator");

// Middleware untuk validasi input (tidak berubah)
const validateExpertInput = [
  body("nmExpert", "Expert name is required").notEmpty(),
  body("emailExpert", "Please include a valid email").isEmail(),
  body("password", "Password must be 6 or more characters").isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Route yang sudah ada (tidak berubah)
router.get("/", authMiddleware(["Admin"]), getExperts);
router.post("/", authMiddleware(["Admin"]), validateExpertInput, createExpertUser);
router.get("/my-dashboard", authMiddleware(["Expert"]), getMyDashboardData);




module.exports = router;