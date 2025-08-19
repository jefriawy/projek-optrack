// backend/controllers/salesController.js
const Sales = require("../models/sales");

const getSalesData = async (req, res) => {
  try {
    const salesData = await Sales.findAllWithCustomerCount();
    res.json(salesData);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getSalesData };