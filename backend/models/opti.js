// backend/models/opti.js
const pool = require("../config/database");

const Opti = {
  async create(optiData, idSales) {
    // Terima idSales sebagai parameter
    const {
      nmOpti,
      contactOpti,
      mobileOpti,
      emailOpti,
      statOpti,
      propOpti,
      datePropOpti,
      idCustomer,
      kebutuhan,
      idSumber,
    } = optiData;

    // Tambahkan idSales ke dalam query INSERT
    const [result] = await pool.query(
      `INSERT INTO opti (nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, propOpti, datePropOpti, idCustomer, kebutuhan, idSumber, idSales)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // Tambahkan satu placeholder
      [
        nmOpti,
        contactOpti,
        mobileOpti,
        emailOpti,
        statOpti,
        propOpti,
        datePropOpti,
        idCustomer,
        kebutuhan,
        idSumber,
        idSales, // Masukkan nilainya di sini
      ]
    );
    return { idOpti: result.insertId, ...optiData, idSales };
  },

  // Mengambil semua data Opti dengan join ke tabel lain
  async findAll() {
    const query = `
      SELECT 
        o.*, 
        c.nmCustomer, 
        c.corpCustomer, 
        s.nmSumber
      FROM opti o
      LEFT JOIN customer c ON o.idCustomer = c.idCustomer
      LEFT JOIN sumber s ON o.idSumber = s.idSumber
      ORDER BY o.datePropOpti DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  // Mengambil data sumber untuk dropdown
  async findSumberOptions() {
    const [rows] = await pool.query("SELECT idSumber, nmSumber FROM sumber");
    return rows;
  },

  // Mengambil satu Opti berdasarkan ID
  async findById(idOpti) {
    const query = `
      SELECT o.*, c.nmCustomer, c.corpCustomer, s.nmSumber
      FROM opti o
      LEFT JOIN customer c ON o.idCustomer = c.idCustomer
      LEFT JOIN sumber s ON o.idSumber = s.idSumber
      WHERE o.idOpti = ?
    `;
    const [rows] = await pool.query(query, [idOpti]);
    return rows[0];
  },

  // Memperbarui data Opti
  async update(idOpti, optiData) {
    const {
      nmOpti,
      contactOpti,
      mobileOpti,
      emailOpti,
      statOpti,
      propOpti,
      datePropOpti,
      idCustomer,
      idSumber,
      kebutuhan,
    } = optiData;
    const [result] = await pool.query(
      `UPDATE opti SET nmOpti = ?, contactOpti = ?, mobileOpti = ?, emailOpti = ?, statOpti = ?, propOpti = ?, datePropOpti = ?, idCustomer = ?, idSumber = ?, kebutuhan = ? WHERE idOpti = ?`,
      [
        nmOpti,
        contactOpti,
        mobileOpti,
        emailOpti,
        statOpti,
        propOpti,
        datePropOpti,
        idCustomer,
        idSumber,
        kebutuhan,
        idOpti,
      ]
    );
    return result.affectedRows;
  },
};

module.exports = Opti;