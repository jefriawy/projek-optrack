// backend/controllers/adminController.js
const pool = require("../config/database");
const bcrypt = require("bcrypt");
const { generateUserId } = require("../utils/idGenerator");
const Akademik = require("../models/akademik");
const PM = require("../models/pm");

const createAdmin = async (req, res) => {
  const { nmAdmin, emailAdmin, password, mobileAdmin } = req.body;

  // Validasi input dasar
  if (!nmAdmin || !emailAdmin || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    // Cek apakah email sudah digunakan
    const [existingAdmin] = await pool.query(
      "SELECT * FROM admin WHERE emailAdmin = ?",
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

const createAkademik = async (req, res) => {
  const { nmAkademik, emailAkademik, password, mobileAkademik } = req.body;

  if (!nmAkademik || !emailAkademik || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    console.log("Creating Akademik user...");
    console.log("Plain password received:", password);

    const existingAkademik = await Akademik.findByEmail(emailAkademik);
    if (existingAkademik) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const newAkademikId = await generateUserId('Akademik');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password generated:", hashedPassword);

    const userData = { idAkademik: newAkademikId, nmAkademik, emailAkademik, password: hashedPassword, mobileAkademik };
    console.log("Data to be saved to Akademik model:", userData);

    await Akademik.create(userData);
    res.status(201).json({ message: "Akademik user created successfully", idAkademik: newAkademikId });
  } catch (error) {
    console.error("Error creating Akademik user:", error);
    res.status(500).json({ error: "Server error while creating Akademik user." });
  }
};

const createPM = async (req, res) => {
  const { nmPM, emailPM, password, mobilePM } = req.body;

  if (!nmPM || !emailPM || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    const existingPM = await PM.findByEmail(emailPM);
    if (existingPM) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const newPMId = await generateUserId('PM');
    const hashedPassword = await bcrypt.hash(password, 10);

    await PM.create({ idPM: newPMId, nmPM, emailPM, password: hashedPassword, mobilePM });
    res.status(201).json({ message: "PM user created successfully", idPM: newPMId });
  } catch (error) {
    console.error("Error creating PM user:", error);
    res.status(500).json({ error: "Server error while creating PM user." });
  }
};

module.exports = {
  createAdmin,
  createAkademik,
  createPM,
};
