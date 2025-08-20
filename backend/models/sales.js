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
        u.role,
        COUNT(c.idCustomer) AS totalCustomer
      FROM
        sales s
      LEFT JOIN
        customer c ON s.idSales = c.idSales
      LEFT JOIN
        users u ON s.userId = u.id
      GROUP BY
        s.idSales, s.nmSales, s.mobileSales, s.emailSales, u.role
      ORDER BY
        s.nmSales
    `);
    return rows;
  }
};

module.exports = Sales;