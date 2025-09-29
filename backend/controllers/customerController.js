// backend/controllers/customerController.js
const Customer = require("../models/customer");
const pool = require("../config/database");
const { generateUserId } = require("../utils/idGenerator");
const { exportToXlsx } = require("../utils/CustomerXlsx.js");

const createCustomer = async (req, res) => {
  try {
    const customerData = req.body;

    // Server-side validation for NPWP
    if (customerData.customerCat === 'Perusahaan' && !customerData.NPWP) {
      return res.status(400).json({ error: "NPWP is required for company customers" });
    }

    // generate idCustomer
    customerData.idCustomer = await generateUserId("Customer");

    const userId = req.user.id;
    console.log(
      "Creating customer with data:",
      customerData,
      "userId:",
      userId
    );
    // req.user.id already contains idSales for Sales users (see authController login).
    // Verify that the idSales exists in the sales table.
    const idSales = userId;
    const [salesRow] = await pool.query(
      "SELECT idSales FROM sales WHERE idSales = ?",
      [idSales]
    );
    if (!salesRow.length) {
      console.log("No Sales record found for idSales:", idSales);
      return res
        .status(400)
        .json({ error: "No Sales record found for this user" });
    }

    const newCustomer = await Customer.create(customerData, idSales);
    res.status(201).json({ message: "Customer created", data: newCustomer });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

const getCustomers = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { status: statusFilter, corpCustomer, nmSales } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const searchParams = { searchTerm: corpCustomer || nmSales, searchBy: corpCustomer ? 'corpCustomer' : 'nmSales' };

    console.log("Fetching customers for user:", { userId, role, statusFilter, searchParams, page, limit });

    let customers;
    let totalCustomers;

    if (role === "Sales") {
      const idSales = userId;
      const [salesRow] = await pool.query(
        "SELECT idSales FROM sales WHERE idSales = ?",
        [idSales]
      );
      if (!salesRow.length) {
        return res.status(403).json({ error: "User is not a registered sales" });
      }
      customers = await Customer.findBySalesId(idSales, statusFilter, searchParams, limit, offset);
      totalCustomers = await Customer.countBySalesId(idSales, statusFilter, searchParams);
    } else if (role === "Admin" || role === "Head Sales") {
      customers = await Customer.findAll(statusFilter, searchParams, limit, offset);
      totalCustomers = await Customer.countAll(statusFilter, searchParams);
    } else {
      console.log("Unauthorized role:", role);
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const totalPages = Math.ceil(totalCustomers / limit);

    res.json({ data: customers, totalPages, currentPage: parseInt(page) });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

const getStatusOptions = async (req, res) => {
  try {
    const statusOptions = await Customer.findStatusOptions();
    res.json(statusOptions);
  } catch (error) {
    console.error("Error fetching status options:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customerData = req.body;

    // Server-side validation for NPWP on update
    if (customerData.customerCat === 'Perusahaan' && !customerData.NPWP) {
      return res.status(400).json({ error: "NPWP is required for company customers" });
    }

    // Lakukan update ke database sesuai kebutuhan
    const [result] = await pool.query(
      `UPDATE customer SET nmCustomer=?, mobileCustomer=?, emailCustomer=?, addrCustomer=?, corpCustomer=?, idStatCustomer=?, descCustomer=?, customerCat=?, NPWP=? WHERE idCustomer=?`,
      [
        customerData.nmCustomer,
        customerData.mobileCustomer || null,
        customerData.emailCustomer,
        customerData.addrCustomer || null,
        customerData.corpCustomer || null,
        customerData.idStatCustomer,
        customerData.descCustomer || null,
        customerData.customerCat,
        customerData.NPWP || null,
        id,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const exportCustomers = async (req, res) => {
  try {
    const { user } = req;
    const { status: statusFilter, corpCustomer, nmSales } = req.query;
    const searchParams = { searchTerm: corpCustomer || nmSales, searchBy: corpCustomer ? 'corpCustomer' : 'nmSales' };

    const customers = await Customer.findAllForExport(statusFilter, searchParams, user);

    const columns = [
      'nmCustomer',
      'mobileCustomer',
      'emailCustomer',
      'addrCustomer',
      'corpCustomer',
      'nmStatCustomer',
      'nmSales',
      'tglInput',
      'customerCat',
      'NPWP'
    ];

    const xlsxBuffer = exportToXlsx(customers, columns, 'Customers');

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "customers.xlsx"
    );
    res.send(xlsxBuffer);
  } catch (error) {
    console.error("Error exporting customers to XLSX:", error);
    res.status(500).json({ error: "Server error during export" });
  }
};

const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { idStatCustomer } = req.body;

    if (!idStatCustomer) {
      return res.status(400).json({ error: "idStatCustomer is required" });
    }

    const [result] = await pool.query(
      `UPDATE customer SET idStatCustomer = ? WHERE idCustomer = ?`,
      [idStatCustomer, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createCustomer, getCustomers, getStatusOptions, getCustomerById, updateCustomer, exportCustomers, updateCustomerStatus };