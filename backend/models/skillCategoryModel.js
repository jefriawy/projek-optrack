// backend/models/skillCategoryModel.js
const pool = require("../config/database");

const SkillCategory = {
  async findAll() {
    const [rows] = await pool.query(
      "SELECT idSkillCtg, nmSkillCtg FROM skill_category ORDER BY nmSkillCtg ASC"
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM skill_category WHERE idSkillCtg = ?",
      [id]
    );
    return rows[0];
  },

  async create(data) {
    const { nmSkillCtg, descSkillCtg, statSkillCtg = 'Active' } = data;
    const [result] = await pool.query(
      "INSERT INTO skill_category (nmSkillCtg, descSkillCtg, statSkillCtg) VALUES (?, ?, ?)",
      [nmSkillCtg, descSkillCtg || null, statSkillCtg]
    );
    return result; // Mengembalikan hasil query INSERT (termasuk insertId jika auto-increment)
  },
};

module.exports = SkillCategory;
