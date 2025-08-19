// backend/models/user.js
const pool = require("../config/database");
const bcrypt = require("bcrypt");

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

    async findById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async create(userData, connection = pool) {
    const { name, email, password, role } = userData;
    const result = await connection.query(
      `INSERT INTO users (name, email, password, role, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [name, email, password, role]
    );
    return result[0];
  },

  async createSales(salesData, connection = pool) {
    const { nmSales, emailSales, mobileSales, descSales, userId } = salesData;
    const result = await connection.query(
      `INSERT INTO sales (nmSales, emailSales, mobileSales, descSales, userId)
       VALUES (?, ?, ?, ?, ?)`,
      [nmSales, emailSales, mobileSales || null, descSales || null, userId]
    );
    return result[0];
  },

  async findAll() {
    const [rows] = await pool.query("SELECT id, name, email, role FROM users");
    return rows;
  },

  async delete(userId, connection = pool) {
    await connection.query("DELETE FROM users WHERE id = ?", [userId]);
  },

  async deleteSales(userId, connection = pool) {
    await connection.query("DELETE FROM sales WHERE userId = ?", [userId]);
  },
};

module.exports = User;
