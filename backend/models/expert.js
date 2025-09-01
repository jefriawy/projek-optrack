// backend/models/expert.js
const pool = require("../config/database");

const Expert = {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT e.idExpert, e.nmExpert, e.mobileExpert, e.emailExpert, e.idSkill, e.statExpert, COUNT(o.idOpti) AS totalProjects
       FROM expert e
       LEFT JOIN opti o ON e.idExpert = o.idExpert
       GROUP BY e.idExpert, e.nmExpert, e.mobileExpert, e.emailExpert, e.idSkill, e.statExpert
       ORDER BY e.nmExpert ASC`
    );
    return rows;
  },

  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM expert WHERE emailExpert = ?", [
      email,
    ]);
    return rows[0];
  },

  async create(expertData) {
    const { idExpert, nmExpert, emailExpert, password, mobileExpert, idSkill, statExpert, Row } = expertData;
    const [result] = await pool.query(
      `INSERT INTO expert (idExpert, nmExpert, emailExpert, password, mobileExpert, idSkill, statExpert, Row)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [idExpert, nmExpert, emailExpert, password, mobileExpert || null, idSkill || null, statExpert || null, Row || null]
    );
    return result;
  },
};

module.exports = Expert;
