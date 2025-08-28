// backend/models/sales.js
const pool = require("../config/database");

const Sales = {
  async findAllWithCustomerCount() {
    const [rows] = await pool.query(`
      SELECT
        s.idSales,
        s.nmSales,
        s.mobileSales,
        s.emailSales,
        s.role,
        COUNT(c.idCustomer) AS totalCustomer
      FROM
        sales s
      LEFT JOIN
        customer c ON s.idSales = c.idSales
      GROUP BY
        s.idSales, s.nmSales, s.mobileSales, s.emailSales, s.role
      ORDER BY
        s.nmSales
    `);
    return rows;
  },

  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM sales WHERE emailSales = ?", [
      email,
    ]);
    return rows[0];
  },

  async create(salesData) {
    const { idSales, nmSales, emailSales, password, mobileSales, descSales, role } = salesData;
    const [result] = await pool.query(
      `INSERT INTO sales (idSales, nmSales, emailSales, password, mobileSales, descSales, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [idSales, nmSales, emailSales, password, mobileSales || null, descSales || null, role]
    );
    return result;
  },
};

module.exports = Sales;