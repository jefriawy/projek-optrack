const Expert = require("../models/expert");
const bcrypt = require("bcrypt");
const { generateUserId } = require("../utils/idGenerator");

const getExperts = async (_req, res) => {
  try {
    const experts = await Expert.findAll();
    res.json(experts);
  } catch (err) {
    console.error("getExperts error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const createExpertUser = async (req, res) => {
  console.log("Attempting to create expert with data:", req.body); // <-- Added for debugging

  const { nmExpert, emailExpert, password, mobileExpert, idSkill, statExpert, Row } = req.body;

  // Validasi input
  if (!nmExpert || !emailExpert || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    // Cek email duplikat
    const existingUser = await Expert.findByEmail(emailExpert);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Generate new user ID
    const newExpertId = await generateUserId('Expert');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    await Expert.create({
      idExpert: newExpertId,
      nmExpert,
      emailExpert,
      password: hashedPassword,
      mobileExpert,
      idSkill,
      statExpert,
      Row,
    });

    res.status(201).json({ message: "Expert user created successfully", idExpert: newExpertId });

  } catch (error) {
    console.error("Error creating expert user:", error.message); // <-- More specific logging
    console.error("Full error object:", error); // <-- Added for debugging
    res.status(500).json({ error: "Server error while creating expert user.", details: error.sqlMessage });
  }
};

module.exports = { getExperts, createExpertUser };
