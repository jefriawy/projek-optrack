// backend/models/opti.js
const pool = require("../config/database");

const Opti = {
  async create(optiData, idSales, connection = pool) {
    const {
      idOpti,
      nmOpti,
      contactOpti,
      mobileOpti,
      emailOpti,
      statOpti,
      datePropOpti,
      idCustomer,
      idSumber,
      kebutuhan,
      jenisOpti,
      idExpert = null,
      proposalOpti = null,
      valOpti = null,
    } = optiData;
    const query = `
      INSERT INTO opti
        (idOpti, nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, datePropOpti,
         idCustomer, idSumber, kebutuhan, idSales, jenisOpti, idExpert, proposalOpti, valOpti)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      idOpti,
      nmOpti,
      contactOpti,
      mobileOpti,
      emailOpti,
      statOpti,
      datePropOpti,
      idCustomer,
      idSumber,
      kebutuhan,
      idSales,
      jenisOpti,
      idExpert,
      proposalOpti,
      valOpti,
    ];
    await connection.query(query, params);
    return { idOpti };
  },

  async findAllPaginated(searchTerm, limit, offset, user) {
    let baseQuery = `
      FROM opti o
      LEFT JOIN customer c ON o.idCustomer = c.idCustomer
      LEFT JOIN sumber s   ON o.idSumber   = s.idSumber
      LEFT JOIN expert e   ON o.idExpert   = e.idExpert
      LEFT JOIN sales  sl  ON o.idSales    = sl.idSales
    `;
    const params = [];
    const whereClauses = [];

    if (searchTerm) {
      whereClauses.push(`(o.nmOpti LIKE ? OR c.corpCustomer LIKE ?)`);
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    if (user && user.role === "Sales") {
      whereClauses.push(`o.idSales = ?`);
      params.push(user.id);
    }

    if (whereClauses.length > 0) {
      baseQuery += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    const countQuery = `SELECT COUNT(*) AS totalCount ${baseQuery}`;
    const [countRows] = await pool.query(countQuery, params);
    const totalCount = countRows[0].totalCount;

    const dataQuery = `
      SELECT
        o.*, c.nmCustomer, c.corpCustomer, s.nmSumber, e.nmExpert, sl.nmSales
      ${baseQuery}
      ORDER BY o.idOpti DESC
      LIMIT ?
      OFFSET ?
    `;
    const [dataRows] = await pool.query(dataQuery, [...params, limit, offset]);

    return [dataRows, totalCount];
  },

  async findSumberOptions() {
    const [rows] = await pool.query("SELECT idSumber, nmSumber FROM sumber");
    return rows;
  },

  async findById(idOpti, user) {
    const query = `
      SELECT
        o.*, c.corpCustomer, s.nmSumber, e.nmExpert, sl.nmSales,
        t.idTraining, t.idTypeTraining, t.startTraining, t.endTraining, t.placeTraining,
        tt.nmTypeTraining,
        p.idProject, p.startProject, p.endProject, p.idTypeProject
      FROM opti o
      LEFT JOIN customer     c  ON o.idCustomer = c.idCustomer
      LEFT JOIN sumber       s  ON o.idSumber   = s.idSumber
      LEFT JOIN sales        sl ON o.idSales    = sl.idSales
      LEFT JOIN expert       e  ON o.idExpert   = e.idExpert
      LEFT JOIN training     t  ON o.idOpti     = t.idOpti
      LEFT JOIN typetraining tt ON t.idTypeTraining = tt.idTypeTraining
      LEFT JOIN project      p  ON o.idOpti     = p.idOpti
      WHERE o.idOpti = ?
      LIMIT 1
    `;

    const [rows] = await pool.query(query, [idOpti]);
    const opti = rows[0];
    if (!opti) return null;

    if (user && user.role === "Sales" && opti.idSales !== user.id) {
      return null;
    }

    return opti;
  },

  async update(idOpti, optiData, connection = pool) {
    const {
      nmOpti,
      contactOpti,
      mobileOpti,
      emailOpti,
      statOpti,
      datePropOpti,
      idCustomer,
      idSumber,
      kebutuhan,
      jenisOpti,
      idExpert,
      proposalOpti,
      valOpti = null,
    } = optiData;

    const [result] = await connection.query(
      `UPDATE opti SET
         nmOpti = ?, contactOpti = ?, mobileOpti = ?, emailOpti = ?, statOpti = ?,
         datePropOpti = ?, idCustomer = ?, idSumber = ?, kebutuhan = ?,
         jenisOpti = ?, idExpert = ?, proposalOpti = ?, valOpti = ?
       WHERE idOpti = ?`,
      [
        nmOpti,
        contactOpti,
        mobileOpti,
        emailOpti,
        statOpti,
        datePropOpti,
        idCustomer,
        idSumber,
        kebutuhan,
        jenisOpti,
        idExpert,
        proposalOpti,
        valOpti,
        idOpti,
      ]
    );
    return result.affectedRows;
  },
};

module.exports = Opti;
