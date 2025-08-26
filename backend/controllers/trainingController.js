const pool = require("../config/database");

/**
 * Ambil status opti terakhir per customer.
 * Diambil berdasarkan tanggal proposal paling baru (datePropOpti).
 */
const latestOptiStatusSubquery = `
  LEFT JOIN (
    SELECT o1.idCustomer, o1.statOpti
    FROM opti o1
    INNER JOIN (
      SELECT idCustomer, MAX(datePropOpti) AS maxDate
      FROM opti
      GROUP BY idCustomer
    ) last ON last.idCustomer = o1.idCustomer AND o1.datePropOpti = last.maxDate
    GROUP BY o1.idCustomer
  ) lo ON lo.idCustomer = t.idCustomer
`;

const getTrainings = async (req, res) => {
  try {
    const query = `
      SELECT 
        t.idTraining,
        t.nmTraining,
        t.startTraining,
        t.endTraining,
        t.idCustomer,
        e.nmExpert,
        lo.statOpti
      FROM training t
      LEFT JOIN expert e ON e.idExpert = t.idExpert
      ${latestOptiStatusSubquery}
      ORDER BY t.startTraining DESC, t.idTraining DESC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("getTrainings error:", err);
    res.status(500).json({ error: err.sqlMessage || "Server error" });
  }
};

const getTrainingById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        t.idTraining,
        t.nmTraining,
        t.startTraining,
        t.endTraining,
        t.idCustomer,
        t.placeTraining,
        t.examTraining,
        t.examDateTraining,
        e.nmExpert,
        lo.statOpti
      FROM training t
      LEFT JOIN expert e ON e.idExpert = t.idExpert
      ${latestOptiStatusSubquery}
      WHERE t.idTraining = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [id]);
    if (!rows.length) return res.status(404).json({ error: "Training not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("getTrainingById error:", err);
    res.status(500).json({ error: err.sqlMessage || "Server error" });
  }
};

module.exports = { getTrainings, getTrainingById };
