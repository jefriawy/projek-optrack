const pool = require("../config/database");

const getExperts = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT idExpert, nmExpert, mobileExpert, emailExpert, idSkill, statExpert, userId
       FROM expert
       ORDER BY idExpert DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("getExperts error:", err);
    res.status(500).json({ error: err.sqlMessage || "Server error" });
  }
};

module.exports = { getExperts };
