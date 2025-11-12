// backend/controllers/outsourcerController.js
const Outsourcer = require("../models/outsourcer");
const bcrypt = require("bcrypt");
const { generateUserId } = require("../utils/idGenerator");

const createOutsourcerUser = async (req, res) => {
  const {
    nmOutsourcer,
    emailOutsourcer,
    password,
    mobileOutsourcer,
    statOutsourcer,
    role,
  } = req.body;

  // Validasi input
  if (!nmOutsourcer || !emailOutsourcer || !password || !role) {
    return res
      .status(400)
      .json({ error: "Name, email, password, and role are required." });
  }

  if (!["external", "internal"].includes(role)) {
    return res
      .status(400)
      .json({ error: "Invalid role. Must be 'external' or 'internal'." });
  }

  try {
    // Cek email duplikat
    const existingUser = await Outsourcer.findByEmail(emailOutsourcer);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Generate new user ID
    const newOutsourcerId = await generateUserId("Outsourcer"); // Gunakan role 'Outsourcer'

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    await Outsourcer.create({
      idOutsourcer: newOutsourcerId,
      nmOutsourcer,
      emailOutsourcer,
      password: hashedPassword,
      mobileOutsourcer,
      statOutsourcer,
      role,
    });

    res
      .status(201)
      .json({
        message: "Outsourcer user created successfully",
        idOutsourcer: newOutsourcerId,
      });
  } catch (error) {
    console.error("Error creating outsourcer user:", error);
    res
      .status(500)
      .json({ error: "Server error while creating outsourcer user." });
  }
};

module.exports = { createOutsourcerUser };
