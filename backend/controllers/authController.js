// backend/controllers/authController.js
const User = require("../models/user");
const { generateToken } = require("../utils/jwt");
const { body, validationResult } = require("express-validator");

const login = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array()); // Debug
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findByEmail(email);
      console.log("Login attempt:", { email, userFound: !!user }); // Debug
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        console.log("Password mismatch for user:", email); // Debug
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Izinkan Sales dan Admin login
      if (!["Sales", "Admin", "Head Sales"].includes(user.role)) {
        console.log("Unauthorized role:", user.role); // Debug
        return res.status(403).json({ error: "Only Sales or Admin can login" });
      }

      const token = generateToken(user);
      console.log("Token generated for user:", {
        id: user.id,
        role: user.role,
      }); // Debug
      res.json({ token, role: user.role, userId: user.id, name: user.name });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: error.sqlMessage || "Server error" });
    }
  },
];

const verify = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ userId: user.id, role: user.role, name: user.name });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { login, verify };