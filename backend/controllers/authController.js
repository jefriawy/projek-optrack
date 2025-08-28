// backend/controllers/authController.js
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { body, validationResult } = require("express-validator");
const pool = require("../config/database"); // For admin queries
const Sales = require("../models/sales");
const Expert = require("../models/expert");

// Helper to compare passwords
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const login = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = null;
      let userType = null;

      // 1. Check in Admin table
      const [adminRows] = await pool.query("SELECT * FROM admin WHERE emailAdmin = ?", [email]);
      if (adminRows.length > 0) {
        const adminUser = adminRows[0];
        const isMatch = await comparePassword(password, adminUser.password);
        if (isMatch) {
          user = { id: adminUser.idAdmin, name: adminUser.nmAdmin, role: 'Admin' };
          userType = 'Admin';
        }
      }

      // 2. Check in Sales table if not found
      if (!user) {
        const salesUser = await Sales.findByEmail(email);
        if (salesUser) {
          const isMatch = await comparePassword(password, salesUser.password);
          if (isMatch) {
            user = { id: salesUser.idSales, name: salesUser.nmSales, role: salesUser.role };
            userType = 'Sales';
          }
        }
      }

      // 3. Check in Expert table if not found
      if (!user) {
        const expertUser = await Expert.findByEmail(email);
        if (expertUser) {
          const isMatch = await comparePassword(password, expertUser.password);
          if (isMatch) {
            user = { id: expertUser.idExpert, name: expertUser.nmExpert, role: 'Expert' };
            userType = 'Expert';
          }
        }
      }

      // If user is found and password matches
      if (user) {
        const token = generateToken(user);
        return res.json({ token, role: user.role, userId: user.id, name: user.name });
      }

      // If no user found in any table
      return res.status(401).json({ error: "Invalid credentials" });

    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

// The verify function is used by the authMiddleware.
// After refactoring, the JWT payload itself is the source of truth.
// We don't need to re-query the database here.
const verify = async (req, res) => {
  // req.user is populated by the authMiddleware from the decoded token
  res.json({ userId: req.user.id, role: req.user.role, name: req.user.name });
};

module.exports = { login, verify };