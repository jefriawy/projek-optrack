// backend/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const pool = require("../config/database");
const Sales = require("../models/sales");
const Expert = require("../models/expert");
const Akademik = require("../models/akademik");
const PM = require("../models/pm");
const HR = require("../models/hr");
const Outsourcer = require("../models/outsourcer"); // <-- TAMBAHKAN INI

// Helper function to generate JWT
const generateToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };
  // Token expires in 1 hour
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
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
    case "Expert":
      return "/project";
    case "Trainer":
      return "/training";
    case "Akademik":
      return "/dashboard/akademik";
    case "PM":
      return "/project";
    case "HR":
      return "/outsource";
    case "Outsourcer": // <-- TAMBAHKAN INI
    case "external":
    case "internal":
      return "/outsource"; // (Asumsi Outsourcer melihat halaman outsource)
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

      // Try to find user in Admin table
      const [adminRows] = await pool.query(
        "SELECT idAdmin as id, nmAdmin as name, emailAdmin as email, password, 'Admin' as role FROM admin WHERE emailAdmin = ?",
        [email]
      );
      if (adminRows.length > 0) {
        user = adminRows[0];
      }

      // Try to find user in Sales table
      if (!user) {
        const salesUser = await Sales.findByEmail(email);
        if (salesUser) {
          user = {
            id: salesUser.idSales,
            name: salesUser.nmSales,
            email: salesUser.emailSales,
            role: salesUser.role, // role didapat dari tabel sales
            password: salesUser.password,
          };
        }
      }

      // Try to find user in Expert table
      if (!user) {
        const expertUser = await Expert.findByEmail(email);
        if (expertUser) {
          user = {
            id: expertUser.idExpert,
            name: expertUser.nmExpert,
            email: expertUser.emailExpert,
            role: expertUser.role, // role didapat dari tabel expert
            password: expertUser.password,
          };
        }
      }

      // Try to find user in Akademik table
      if (!user) {
        const akademikUser = await Akademik.findByEmail(email);
        if (akademikUser) {
          user = {
            id: akademikUser.idAkademik,
            name: akademikUser.nmAkademik,
            email: akademikUser.emailAkademik,
            role: "Akademik", // role di-hardcode karena tidak ada di tabel
            password: akademikUser.password,
          };
        }
      }

      // Try to find user in PM table
      if (!user) {
        const pmUser = await PM.findByEmail(email);
        if (pmUser) {
          user = {
            id: pmUser.idPM,
            name: pmUser.nmPM,
            email: pmUser.emailPM,
            role: "PM", // role di-hardcode karena tidak ada di tabel
            password: pmUser.password,
          };
        }
      }

      // Try to find user in HR table
      if (!user) {
        const hrUser = await HR.findByEmail(email);
        if (hrUser) {
          user = {
            id: hrUser.idHR,
            name: hrUser.nmHR,
            email: hrUser.emailHR,
            role: "HR",
            password: hrUser.password,
          };
        }
      }

      // <-- TAMBAHKAN BLOK INI -->
      // Try to find user in Outsourcer table
      if (!user) {
        const outsourcerUser = await Outsourcer.findByEmail(email);
        if (outsourcerUser) {
          // Normalize outsourcer role to a single role value 'Outsourcer'
          // but keep the original role ('external'|'internal') in originalRole
          user = {
            id: outsourcerUser.idOutsourcer,
            name: outsourcerUser.nmOutsourcer,
            email: outsourcerUser.emailOutsourcer,
            role: "Outsourcer",
            originalRole: outsourcerUser.role || "external",
            password: outsourcerUser.password,
          };
        }
      }
      // <-- AKHIR TAMBAHAN -->

      // If user not found in any table
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate token and send response
      const token = generateToken(user);
      const redirectPath = roleToRedirect(user.role);

      return res.json({
        token,
        role: user.role,
        userId: user.id,
        name: user.name,
        redirectPath,
      });
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
