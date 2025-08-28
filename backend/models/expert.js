// backend/models/expert.js
const pool = require("../config/database");

const Expert = {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT idExpert, nmExpert, mobileExpert, emailExpert, idSkill, statExpert
       FROM expert
       ORDER BY nmExpert ASC`
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
