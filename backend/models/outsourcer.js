// backend/models/outsourcer.js
const pool = require("../config/database");

const Outsourcer = {
  async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM outsourcer WHERE emailOutsourcer = ?",
      [email]
    );
    return rows[0];
  },

  async create(data) {
    const {
      idOutsourcer,
      nmOutsourcer,
      emailOutsourcer,
      password,
      mobileOutsourcer,
      statOutsourcer,
      role,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO outsourcer (idOutsourcer, nmOutsourcer, emailOutsourcer, password, mobileOutsourcer, statOutsourcer, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        idOutsourcer,
        nmOutsourcer,
        emailOutsourcer,
        password,
        mobileOutsourcer || null,
        statOutsourcer || null,
        role || "external", // Default ke 'external'
      ]
    );
    return result;
  },
};

module.exports = Outsourcer;
