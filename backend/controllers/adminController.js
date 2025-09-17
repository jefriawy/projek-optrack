// backend/controllers/adminController.js
const pool = require("../config/database");
const bcrypt = require("bcrypt");
const { generateUserId } = require("../utils/idGenerator");
const createAdmin = async (req, res) => {
  const { nmAdmin, emailAdmin, password, mobileAdmin } = req.body;

  // Validasi input dasar
  if (!nmAdmin || !emailAdmin || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    // Cek apakah email sudah digunakan
    const [existingAdmin] = await pool.query(
      "SELECT idAdmin FROM admin WHERE emailAdmin = ?",
      [emailAdmin]
    );

    if (existingAdmin.length > 0) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Generate new admin ID
    const newAdminId = await generateUserId('Admin');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    await pool.query(
      "INSERT INTO admin (idAdmin, nmAdmin, emailAdmin, password, mobileAdmin) VALUES (?, ?, ?, ?, ?)",
      [newAdminId, nmAdmin, emailAdmin, hashedPassword, mobileAdmin || null]
    );

    res.status(201).json({ message: "Admin user created successfully", idAdmin: newAdminId });

  } catch (error) {
    console.error("Error creating admin user:", error);
    res.status(500).json({ error: "Server error while creating admin." });
  }
};

module.exports = {
  createAdmin,
};
