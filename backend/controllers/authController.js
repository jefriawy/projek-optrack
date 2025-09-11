// backend/controllers/authController.js
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { body, validationResult } = require("express-validator");
const pool = require("../config/database");
const Sales = require("../models/sales");
const Expert = require("../models/expert");

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// NEW: role -> dashboard path
const roleToRedirect = (role) => {
  switch (role) {
    case "Admin":
      return "/dashboard-admin";
    case "Head Sales":
      return "/dashboard/head-sales";
    case "Sales":
      return "/dashboard/sales";
    case "Head of Expert":
    case "head of expert":
      return "/dashboard/head-expert";
    case "Expert":
      return "/dashboard/expert";
    default:
      return "/";
  }
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

      // Admin
      const [adminRows] = await pool.query(
        "SELECT * FROM admin WHERE emailAdmin = ?",
        [email]
      );
      if (adminRows.length > 0) {
        const adminUser = adminRows[0];
        const isMatch = await comparePassword(password, adminUser.password);
        if (isMatch) {
          user = {
            id: adminUser.idAdmin,
            name: adminUser.nmAdmin,
            role: "Admin",
          };
        }
      }

      // Sales / Head Sales
      if (!user) {
        const salesUser = await Sales.findByEmail(email);
        if (salesUser) {
          console.log("Sales User found:", salesUser);
          const isMatch = await comparePassword(password, salesUser.password);
          if (isMatch) {
            user = {
              id: salesUser.idSales,
              name: salesUser.nmSales,
              role: salesUser.role, // "Sales" | "Head Sales"
            };
          }
        }
      }

      // Expert / Head of Expert
      if (!user) {
        const expertUser = await Expert.findByEmail(email);
        if (expertUser) {
          const isMatch = await comparePassword(password, expertUser.password);
          if (isMatch) {
            user = {
              id: expertUser.idExpert,
              name: expertUser.nmExpert,
              role: expertUser.role, // "Expert" | "Head of Expert"
            };
          }
        }
      }

      if (user) {
        const token = generateToken(user);
        const redirectPath = roleToRedirect(user.role);
        return res.json({
          token,
          role: user.role,
          userId: user.id,
          name: user.name,
          redirectPath, // <= FE pakai ini buat navigate
        });
      }

      return res.status(401).json({ error: "Invalid credentials" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

// GET /api/auth/verify (pakai authMiddleware di routes)
const verify = async (req, res) => {
  res.json({
    userId: req.user.id,
    role: req.user.role,
    name: req.user.name,
    redirectPath: roleToRedirect(req.user.role), // <= biar FE bisa rehydrate
  });
};

module.exports = { login, verify };
