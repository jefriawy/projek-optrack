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

  // Add create, update, delete functions if needed for managing categories
};

module.exports = SkillCategory;
