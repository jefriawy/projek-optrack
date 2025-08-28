// backend/controllers/salesController.js
const Sales = require("../models/sales");
const bcrypt = require("bcrypt");
const { generateUserId } = require("../utils/idGenerator");

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

const createSalesUser = async (req, res) => {
  const { nmSales, emailSales, password, mobileSales, descSales, role } = req.body;

  // Validasi input
  if (!nmSales || !emailSales || !password || !role) {
    return res.status(400).json({ error: "Name, email, password, and role are required." });
  }

  if (!['Sales', 'Head Sales'].includes(role)) {
    return res.status(400).json({ error: "Invalid role. Must be 'Sales' or 'Head Sales'." });
  }

  try {
    // Cek email duplikat
    const existingUser = await Sales.findByEmail(emailSales);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Generate new user ID
    const newSalesId = await generateUserId(role);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    await Sales.create({
      idSales: newSalesId,
      nmSales,
      emailSales,
      password: hashedPassword,
      mobileSales,
      descSales,
      role,
    });

    res.status(201).json({ message: "Sales user created successfully", idSales: newSalesId });

  } catch (error) {
    console.error("Error creating sales user:", error);
    res.status(500).json({ error: "Server error while creating sales user." });
  }
};

module.exports = { getSalesData, createSalesUser };