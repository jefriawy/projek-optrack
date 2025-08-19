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
        COUNT(c.idCustomer) AS totalCustomer
      FROM
        sales s
      LEFT JOIN
        customer c ON s.idSales = c.idSales
      GROUP BY
        s.idSales, s.nmSales, s.mobileSales, s.emailSales
      ORDER BY
        s.nmSales
    `);
    return rows;
  }
};

module.exports = Sales;