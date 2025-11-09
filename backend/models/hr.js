const pool = require("../config/database");
const bcrypt = require("bcrypt");

const HR = {
  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM hr WHERE emailHR = ?", [email]);
    return rows[0];
  },

  async create({ idHR, nmHR, emailHR, password, mobileHR }) {
    const [result] = await pool.query(
      "INSERT INTO hr (idHR, nmHR, emailHR, password, mobileHR) VALUES (?, ?, ?, ?, ?)",
      [idHR, nmHR, emailHR, password, mobileHR || null]
    );
    return result;
  },
};

module.exports = HR;
