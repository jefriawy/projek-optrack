// backend/models/opti.js
const pool = require("../config/database");

const Opti = {
  async create(optiData, idSales) {
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

    const [result] = await pool.query(
      `INSERT INTO opti (nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, propOpti, datePropOpti, idCustomer, kebutuhan, idSumber, idSales)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        idSales,
      ]
    );
    return { idOpti: result.insertId, ...optiData, idSales };
  },

  async findAllPaginated(searchTerm, limit, offset) {
    let baseQuery = `
      FROM opti o
      LEFT JOIN customer c ON o.idCustomer = c.idCustomer
      LEFT JOIN sumber s ON o.idSumber = s.idSumber
    `;
    const params = [];

    if (searchTerm) {
      baseQuery += ` WHERE c.corpCustomer LIKE ?`;
      params.push(`%${searchTerm}%`);
    }

    // Query untuk menghitung total data
    const countQuery = `SELECT COUNT(*) as totalCount ${baseQuery}`;
    const [countRows] = await pool.query(countQuery, params);
    const totalCount = countRows[0].totalCount;

    // Query untuk mengambil data dengan pagination
    const dataQuery = `
      SELECT
        o.*,
        c.nmCustomer,
        c.corpCustomer,
        s.nmSumber
      ${baseQuery}
      ORDER BY o.datePropOpti DESC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, limit, offset];
    const [dataRows] = await pool.query(dataQuery, dataParams);

    return [dataRows, totalCount];
  },

  async findSumberOptions() {
    const [rows] = await pool.query("SELECT idSumber, nmSumber FROM sumber");
    return rows;
  },

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