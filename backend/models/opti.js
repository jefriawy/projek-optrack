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
      jenisOpti,
      namaExpert,
      proposalOpti,
    } = optiData;

    const [result] = await pool.query(
      `INSERT INTO opti (nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, propOpti, datePropOpti, idCustomer, kebutuhan, idSumber, idSales, jenisOpti, namaExpert, proposalOpti)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        jenisOpti,
        namaExpert,
        proposalOpti,
      ]
    );
    return { idOpti: result.insertId, ...optiData, idSales };
  },

  async findAllPaginated(searchTerm, limit, offset, user) {
    let baseQuery = `
      FROM opti o
      LEFT JOIN customer c ON o.idCustomer = c.idCustomer
      LEFT JOIN sumber s ON o.idSumber = s.idSumber
    `;
    const params = [];
    let whereClauses = [];

    if (searchTerm) {
      whereClauses.push(`c.corpCustomer LIKE ?`);
      params.push(`%${searchTerm}%`);
    }

    if (user && user.role === "Sales") {
      const [sales] = await pool.query("SELECT idSales FROM sales WHERE userId = ?", [user.id]);
      if (sales.length > 0) {
        const idSales = sales[0].idSales;
        whereClauses.push(`o.idSales = ?`);
        params.push(idSales);
      } else {
        // If the user is a sales person but not in the sales table, return no data
        return [[], 0];
      }
    }

    if (whereClauses.length > 0) {
      baseQuery += ` WHERE ${whereClauses.join(" AND ")}`;
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
      jenisOpti,
      namaExpert,
      proposalOpti,
    } = optiData;
    const [result] = await pool.query(
      `UPDATE opti SET nmOpti = ?, contactOpti = ?, mobileOpti = ?, emailOpti = ?, statOpti = ?, propOpti = ?, datePropOpti = ?, idCustomer = ?, idSumber = ?, kebutuhan = ?, jenisOpti = ?, namaExpert = ?, proposalOpti = ? WHERE idOpti = ?`,
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
        jenisOpti,
        namaExpert,
        proposalOpti,
        idOpti,
      ]
    );
    return result.affectedRows;
  },
};

module.exports = Opti;