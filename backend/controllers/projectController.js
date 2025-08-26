const pool = require("../config/database");

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
  ) lo ON lo.idCustomer = p.idCustomer
`;

const getProjects = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.idProject,
        p.nmProject,
        p.startProject,
        p.endProject,
        p.idCustomer,
        e.nmExpert,
        lo.statOpti
      FROM project p
      LEFT JOIN expert e ON e.idExpert = p.idExpert
      ${latestOptiStatusSubquery}
      ORDER BY p.startProject DESC, p.idProject DESC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("getProjects error:", err);
    res.status(500).json({ error: err.sqlMessage || "Server error" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        p.idProject,
        p.nmProject,
        p.startProject,
        p.endProject,
        p.idCustomer,
        e.nmExpert,
        lo.statOpti
      FROM project p
      LEFT JOIN expert e ON e.idExpert = p.idExpert
      ${latestOptiStatusSubquery}
      WHERE p.idProject = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [id]);
    if (!rows.length) return res.status(404).json({ error: "Project not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("getProjectById error:", err);
    res.status(500).json({ error: err.sqlMessage || "Server error" });
  }
};

module.exports = { getProjects, getProjectById };
