// backend/models/statCustomer.js
const pool = require("../config/database");

const StatCustomer = {
  async findAll() {
    const [rows] = await pool.query(
      "SELECT idStatCustomer, nmStatCustomer FROM statcustomer"
    );
    return rows;
  },
};

module.exports = StatCustomer;
