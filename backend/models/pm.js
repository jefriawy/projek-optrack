const pool = require("../config/database");
const bcrypt = require("bcrypt");

const PM = {
  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM pm WHERE emailPM = ?", [email]);
    return rows[0];
  },

  async create({ nmPM, emailPM, password, mobilePM, idPM }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO pm (idPM, nmPM, emailPM, password, mobilePM) VALUES (?, ?, ?, ?, ?)",
      [idPM, nmPM, emailPM, hashedPassword, mobilePM || null]
    );
    return result[0];
  },
};

module.exports = PM;
