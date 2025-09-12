// backend/models/customer.js
const pool = require("../config/database");

const Customer = {
  async create(customerData, idSales) {
    // pastikan customerData.idCustomer sudah di-generate sebelum dipanggil
    const {
      idCustomer,
      nmCustomer,
      mobileCustomer = null,
      emailCustomer,
      addrCustomer = null,
      corpCustomer = null,
      idStatCustomer = 1,
      descCustomer = null,
      customerCat,
      NPWP = null,
    } = customerData;

    const query = `INSERT INTO customer
      (idCustomer, nmCustomer, mobileCustomer, emailCustomer, addrCustomer, corpCustomer, idSales, idStatCustomer, descCustomer, customerCat, NPWP)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      idCustomer,
      nmCustomer,
      mobileCustomer,
      emailCustomer,
      addrCustomer,
      corpCustomer,
      idSales,
      idStatCustomer,
      descCustomer,
      customerCat,
      NPWP,
    ];
    const [result] = await pool.query(query, params);
    // kembalikan id yang kita set (jika ingin konsisten)
    return idCustomer;
  },

  async findBySalesId(idSales, statusFilter, searchTerm) {
    let query = `SELECT c.*, c.tglInput, sc.nmStatCustomer, s.nmSales FROM customer c JOIN statcustomer sc ON c.idStatCustomer = sc.idStatCustomer JOIN sales s ON c.idSales = s.idSales WHERE c.idSales = ?`;
    const params = [idSales];

    if (statusFilter) {
      query += ` AND c.idStatCustomer = ?`;
      params.push(statusFilter);
    }

    if (searchTerm) {
      query += ` AND c.corpCustomer LIKE ?`;
      params.push(`%${searchTerm}%`);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findAll(statusFilter, searchTerm) {
    let query = `SELECT c.*, c.tglInput, sc.nmStatCustomer, s.nmSales FROM customer c JOIN statcustomer sc ON c.idStatCustomer = sc.idStatCustomer JOIN sales s ON c.idSales = s.idSales`;
    const params = [];
    const conditions = [];

    if (statusFilter) {
      conditions.push("c.idStatCustomer = ?");
      params.push(statusFilter);
    }

    if (searchTerm) {
      conditions.push("c.corpCustomer LIKE ?");
      params.push(`%${searchTerm}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findStatusOptions() {
    const [rows] = await pool.query(
      "SELECT idStatCustomer, nmStatCustomer FROM statcustomer"
    );
    return rows;
  },

  async findUniqueCorpCustomers() {
    const [rows] = await pool.query("SELECT DISTINCT idCustomer, corpCustomer FROM customer WHERE corpCustomer IS NOT NULL AND corpCustomer != '' ORDER BY corpCustomer ASC");
    return rows;
  },

  async findById(id) {
    // KESALAHAN ADA DI SINI. Query dimulai dengan baris baru.
    // PERBAIKAN: Gunakan .trim() untuk menghapus spasi/baris baru di awal dan akhir.
    const query = `
      SELECT c.*, sc.nmStatCustomer, s.nmSales
      FROM customer c
      JOIN statcustomer sc ON c.idStatCustomer = sc.idStatCustomer
      JOIN sales s ON c.idSales = s.idSales
      WHERE c.idCustomer = ?
    `;
    const [rows] = await pool.query(query.trim(), [id]); // Tambahkan .trim() di sini
    return rows[0];
  },
};

module.exports = Customer;