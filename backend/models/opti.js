const pool = require("../config/database");

const Opti = {
  // CREATE: gunakan idOpti yang kamu kirim dari controller (bukan auto inc)
  async create(optiData, idSales) {
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
    } = optiData;

    const query = `
      INSERT INTO opti
      (idOpti, nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, datePropOpti,
       idCustomer, idSumber, kebutuhan, idSales, jenisOpti, idExpert, proposalOpti)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      idOpti, nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, datePropOpti,
      idCustomer, idSumber, kebutuhan, idSales, jenisOpti, idExpert, proposalOpti,
    ];

    await pool.query(query, params);
    return { idOpti }; // konsisten dengan controller yang pakai idOpti manual
  },

  async findAllPaginated(searchTerm, limit, offset, user) {
    let baseQuery = `
      FROM opti o
      LEFT JOIN customer c ON o.idCustomer = c.idCustomer
      LEFT JOIN sumber s ON o.idSumber = s.idSumber
      LEFT JOIN expert e ON o.idExpert = e.idExpert
      LEFT JOIN sales sl ON o.idSales = sl.idSales
    `;
    const params = [];
    const whereClauses = [];

    if (searchTerm) {
      whereClauses.push(`c.corpCustomer LIKE ?`);
      params.push(`%${searchTerm}%`);
    }
    if (user && user.role === "Sales") {
      const idSales = user.id;
      const [salesRow] = await pool.query(
        "SELECT idSales FROM sales WHERE idSales = ?",
        [idSales]
      );
      if (salesRow.length > 0) {
        whereClauses.push(`o.idSales = ?`);
        params.push(idSales);
      } else {
        return [[], 0];
      }
    }
    if (whereClauses.length > 0) {
      baseQuery += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    const countQuery = `SELECT COUNT(*) as totalCount ${baseQuery}`;
    const [countRows] = await pool.query(countQuery, params);
    const totalCount = countRows[0].totalCount;

    const dataQuery = `
      SELECT o.*, c.nmCustomer, c.corpCustomer, s.nmSumber, e.nmExpert, sl.nmSales
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

  // DETAIL: JOIN ke training & typetraining + project
  async findById(idOpti) {
    const query = `
      SELECT
        o.*,
        c.corpCustomer,
        s.nmSumber,
        e.nmExpert,
        sl.nmSales,
        t.idTraining,
        t.idTypeTraining,        -- penting untuk fallback di FE
        t.startTraining,
        t.endTraining,
        t.placeTraining,
        tt.nmTypeTraining,
        p.idProject,
        p.startProject,
        p.endProject
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
    return rows[0];
  },

  async update(idOpti, optiData) {
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
    } = optiData;

    const [result] = await pool.query(
      `UPDATE opti SET 
        nmOpti = ?, contactOpti = ?, mobileOpti = ?, emailOpti = ?, statOpti = ?, 
        datePropOpti = ?, idCustomer = ?, idSumber = ?, kebutuhan = ?, 
        jenisOpti = ?, idExpert = ?, proposalOpti = ?
       WHERE idOpti = ?`,
      [
        nmOpti, contactOpti, mobileOpti, emailOpti, statOpti,
        datePropOpti, idCustomer, idSumber, kebutuhan,
        jenisOpti, idExpert, proposalOpti, idOpti,
      ]
    );
    return result.affectedRows;
  },
};

module.exports = Opti;
