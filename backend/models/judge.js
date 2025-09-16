// backend/models/judge.js
const pool = require("../config/database");
const bcrypt = require("bcrypt");

const { generateUserId } = require("../utils/idGenerator");

const Judge = {
  async create(judgeData) {
    const { nmJudge, emailJudge, password, mobileJudge, roleJudge } = judgeData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const idJudge = await generateUserId(roleJudge);
    const [result] = await pool.query(
      `INSERT INTO judge (idJudge, nmJudge, emailJudge, password, mobileJudge, roleJudge)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [idJudge, nmJudge, emailJudge, hashedPassword, mobileJudge || null, roleJudge]
    );
    return result;
  },

  async findByEmail(emailJudge) {
    const [rows] = await pool.query("SELECT * FROM judge WHERE emailJudge = ?", [emailJudge]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await pool.query("SELECT * FROM judge");
    return rows;
  }
};

module.exports = Judge;
