const pool = require("../config/database");

const getOutsources = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT idOutsource, nmOutsource, qtyOutsource, descOutsource, idSkill, idCustomer
       FROM outsource
       ORDER BY idOutsource DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("getOutsources error:", err);
    res.status(500).json({ error: err.sqlMessage || "Server error" });
  }
};

module.exports = { getOutsources };
