// backend/controllers/skillController.js

const pool = require("../config/database");

const getSkills = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT idSkill, nmSkill FROM skill ORDER BY nmSkill ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getSkills };
