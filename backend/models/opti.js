// backend/models/opti.js
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
      idExpert, // Diubah dari namaExpert
      proposalOpti,
    } = optiData;

    const [result] = await pool.query(
      `INSERT INTO opti (nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, propOpti, datePropOpti, idCustomer, kebutuhan, idSumber, idSales, jenisOpti, idExpert, proposalOpti)
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
        idExpert, // Diubah dari namaExpert
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
      LEFT JOIN expert e ON o.idExpert = e.idExpert -- Ditambahkan
    `;
    const params = [];
    let whereClauses = [];

    if (searchTerm) {
      whereClauses.push(`c.corpCustomer LIKE ?`);
      params.push(`%${searchTerm}%`);
    }

    if (user && user.role === "Sales") {
      // user.id is expected to be idSales (from token). Verifikasi keberadaan dan gunakan langsung.
      const idSales = user.id;
      const [salesRow] = await pool.query("SELECT idSales FROM sales WHERE idSales = ?", [idSales]);
      if (salesRow.length > 0) {
        whereClauses.push(`o.idSales = ?`);
        params.push(idSales);
      } else {
        // Sales tidak ditemukan di tabel sales -> kembalikan kosong
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
        s.nmSumber,
        e.nmExpert -- Ditambahkan
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
      SELECT o.*, c.nmCustomer, c.corpCustomer, s.nmSumber, e.nmExpert -- Ditambahkan
      FROM opti o
      LEFT JOIN customer c ON o.idCustomer = c.idCustomer
      LEFT JOIN sumber s ON o.idSumber = s.idSumber
      LEFT JOIN expert e ON o.idExpert = e.idExpert -- Ditambahkan
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
      idExpert, // Diubah dari namaExpert
      proposalOpti,
    } = optiData;
    const [result] = await pool.query(
      `UPDATE opti SET nmOpti = ?, contactOpti = ?, mobileOpti = ?, emailOpti = ?, statOpti = ?, propOpti = ?, datePropOpti = ?, idCustomer = ?, idSumber = ?, kebutuhan = ?, jenisOpti = ?, idExpert = ?, proposalOpti = ? WHERE idOpti = ?`,
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
        idExpert, // Diubah dari namaExpert
        proposalOpti,
        idOpti,
      ]
    );
    return result.affectedRows;
  },
};

module.exports = Opti;

