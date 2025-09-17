// backend/models/opti.js
const pool = require("../config/database");

const Opti = {
  async create(optiData, idSales, connection = pool) {
    const {
      idOpti, nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, datePropOpti,
      idCustomer, idSumber, kebutuhan, jenisOpti, idExpert, proposalOpti, valOpti,
      startProgram, endProgram, placeProgram, idTypeTraining, idTypeProject, buktiPembayaran
    } = optiData;
    const query = `
      INSERT INTO opti
        (idOpti, nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, datePropOpti,
         idCustomer, idSumber, kebutuhan, idSales, jenisOpti, idExpert, proposalOpti, valOpti,
         startProgram, endProgram, placeProgram, idTypeTraining, idTypeProject, buktiPembayaran)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      idOpti, nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, datePropOpti,
      idCustomer, idSumber, kebutuhan, idSales, jenisOpti, idExpert, proposalOpti, valOpti,
      startProgram, endProgram, placeProgram, idTypeTraining, idTypeProject, buktiPembayaran
    ];
    await connection.query(query, params);
    return { idOpti };
  },

  async findAllPaginated(searchTerm, limit, offset, user, program) {
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

    if (program && program !== 'Semua Program') {
      whereClauses.push('o.jenisOpti = ?');
      params.push(program);
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
        o.*, c.corpCustomer, s.nmSumber, e.nmExpert, sl.nmSales
      FROM opti o
      LEFT JOIN customer     c  ON o.idCustomer = c.idCustomer
      LEFT JOIN sumber       s  ON o.idSumber   = s.idSumber
      LEFT JOIN sales        sl ON o.idSales    = sl.idSales
      LEFT JOIN expert       e  ON o.idExpert   = e.idExpert
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
      nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, datePropOpti,
      idCustomer, idSumber, kebutuhan, jenisOpti, idExpert, proposalOpti, valOpti,
      startProgram, endProgram, placeProgram, idTypeTraining, idTypeProject, buktiPembayaran
    } = optiData;

    const [result] = await connection.query(
      `UPDATE opti SET
         nmOpti = ?, contactOpti = ?, mobileOpti = ?, emailOpti = ?, statOpti = ?,
         datePropOpti = ?, idCustomer = ?, idSumber = ?, kebutuhan = ?,
         jenisOpti = ?, idExpert = ?, proposalOpti = ?, valOpti = ?,
         startProgram = ?, endProgram = ?, placeProgram = ?, idTypeTraining = ?,
         idTypeProject = ?, buktiPembayaran = ?
       WHERE idOpti = ?`,
      [
        nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, datePropOpti,
        idCustomer, idSumber, kebutuhan, jenisOpti, idExpert, proposalOpti, valOpti,
        startProgram, endProgram, placeProgram, idTypeTraining, idTypeProject, buktiPembayaran,
        idOpti,
      ]
    );
    return result.affectedRows;
  },

  async updatePaymentProof(idOpti, filename, connection = pool) {
    const query = `
      UPDATE opti
      SET buktiPembayaran = ?
      WHERE idOpti = ?
    `;
    const [result] = await connection.query(query, [filename, idOpti]);
    return result.affectedRows;
  },
};

module.exports = Opti;
