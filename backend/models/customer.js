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

    const tglInput = new Date();

    const query = `INSERT INTO customer
      (idCustomer, nmCustomer, mobileCustomer, emailCustomer, addrCustomer, corpCustomer, idSales, idStatCustomer, descCustomer, customerCat, NPWP, tglInput)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
      tglInput,
    ];
    const [result] = await pool.query(query, params);
    return idCustomer;
  },

  async findBySalesId(idSales, statusFilter, searchParams, limit, offset) {
    let query = `SELECT c.*, c.tglInput, sc.nmStatCustomer, s.nmSales FROM customer c JOIN statcustomer sc ON c.idStatCustomer = sc.idStatCustomer JOIN sales s ON c.idSales = s.idSales WHERE c.idSales = ?`;
    const params = [idSales];

    if (statusFilter) {
      query += ` AND c.idStatCustomer = ?`;
      params.push(statusFilter);
    }

    if (searchParams && searchParams.searchTerm && searchParams.searchBy) {
      const validSearchFields = { corpCustomer: "c.corpCustomer", nmSales: "s.nmSales" };
      if (validSearchFields[searchParams.searchBy]) {
        query += ` AND ${validSearchFields[searchParams.searchBy]} LIKE ?`;
        params.push(`%${searchParams.searchTerm}%`);
      }
    }

    query += ` ORDER BY c.tglInput DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async countBySalesId(idSales, statusFilter, searchParams) {
    let query = `SELECT COUNT(*) as total FROM customer c JOIN sales s ON c.idSales = s.idSales WHERE c.idSales = ?`;
    const params = [idSales];

    if (statusFilter) {
      query += ` AND c.idStatCustomer = ?`;
      params.push(statusFilter);
    }

    if (searchParams && searchParams.searchTerm && searchParams.searchBy) {
      const validSearchFields = { corpCustomer: "c.corpCustomer", nmSales: "s.nmSales" };
      if (validSearchFields[searchParams.searchBy]) {
        query += ` AND ${validSearchFields[searchParams.searchBy]} LIKE ?`;
        params.push(`%${searchParams.searchTerm}%`);
      }
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  },

  async findAll(statusFilter, searchParams, limit, offset) {
    let query = `SELECT c.*, c.tglInput, sc.nmStatCustomer, s.nmSales FROM customer c JOIN statcustomer sc ON c.idStatCustomer = sc.idStatCustomer JOIN sales s ON c.idSales = s.idSales`;
    const params = [];
    const conditions = [];

    if (statusFilter) {
      conditions.push("c.idStatCustomer = ?");
      params.push(statusFilter);
    }

    if (searchParams && searchParams.searchTerm && searchParams.searchBy) {
      const validSearchFields = { corpCustomer: "c.corpCustomer", nmSales: "s.nmSales" };
      if (validSearchFields[searchParams.searchBy]) {
        conditions.push(`${validSearchFields[searchParams.searchBy]} LIKE ?`);
        params.push(`%${searchParams.searchTerm}%`);
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY c.tglInput DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async countAll(statusFilter, searchParams) {
    let query = `SELECT COUNT(*) as total FROM customer c JOIN sales s ON c.idSales = s.idSales`;
    const params = [];
    const conditions = [];

    if (statusFilter) {
      conditions.push("c.idStatCustomer = ?");
      params.push(statusFilter);
    }

    if (searchParams && searchParams.searchTerm && searchParams.searchBy) {
      const validSearchFields = { corpCustomer: "c.corpCustomer", nmSales: "s.nmSales" };
      if (validSearchFields[searchParams.searchBy]) {
        conditions.push(`${validSearchFields[searchParams.searchBy]} LIKE ?`);
        params.push(`%${searchParams.searchTerm}%`);
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  },

  async findAllForExport(statusFilter, searchParams, user) {
    let query = `
      SELECT 
        c.nmCustomer,
        c.mobileCustomer,
        c.emailCustomer,
        c.addrCustomer,
        c.corpCustomer,
        sc.nmStatCustomer,
        s.nmSales,
        DATE_FORMAT(c.tglInput, '%Y-%m-%d %H:%i:%s') AS tglInput,
        c.customerCat,
        c.NPWP
      FROM customer c 
      JOIN statcustomer sc ON c.idStatCustomer = sc.idStatCustomer 
      JOIN sales s ON c.idSales = s.idSales
    `;
    const params = [];
    const conditions = [];

    if (statusFilter) {
      conditions.push("c.idStatCustomer = ?");
      params.push(statusFilter);
    }

    if (searchParams && searchParams.searchTerm && searchParams.searchBy) {
      const validSearchFields = { corpCustomer: "c.corpCustomer", nmSales: "s.nmSales" };
      if (validSearchFields[searchParams.searchBy]) {
        conditions.push(`${validSearchFields[searchParams.searchBy]} LIKE ?`);
        params.push(`%${searchParams.searchTerm}%`);
      }
    }

    if (user && user.role === "Sales") {
      conditions.push(`c.idSales = ?`);
      params.push(user.id);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += ` ORDER BY c.tglInput DESC`;
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
    const [rows] = await pool.query(`
      SELECT 
        c.*, s.nmSales, stat.nmStatCustomer
      FROM customer c
      LEFT JOIN sales s ON c.idSales = s.idSales
      LEFT JOIN statcustomer stat ON c.idStatCustomer = stat.idStatCustomer
      WHERE c.idCustomer = ?`, 
      [id]
    );
    return rows[0];
  },
};

module.exports = Customer;