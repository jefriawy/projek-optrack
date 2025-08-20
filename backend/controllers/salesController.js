// backend/controllers/salesController.js
const Sales = require("../models/sales");

const getSalesData = async (req, res) => {
  try {
    const salesData = await Sales.findAllWithCustomerCount();
    
    // Memisahkan data menjadi Head of Sales dan Sales
    const headSales = salesData.filter(item => item.role === 'Head Sales');
    const regularSales = salesData.filter(item => item.role === 'Sales');

    // Mengirimkan kedua data ke frontend
    res.json({
      headSales: headSales,
      regularSales: regularSales
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getSalesData };