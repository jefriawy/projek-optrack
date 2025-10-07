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
      idExpert,
      idPM,
      proposalOpti,
      valOpti,
      startProgram,
      endProgram,
      placeProgram,
      idTypeTraining,
      idTypeProject,
      dokPendaftaran,
      terminPembayaran,
    } = optiData;
    const query = `
      INSERT INTO opti
        (idOpti, nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, datePropOpti,
         idCustomer, idSumber, kebutuhan, idSales, jenisOpti, idExpert, idPM, proposalOpti, valOpti,
         startProgram, endProgram, placeProgram, idTypeTraining, idTypeProject, dokPendaftaran, terminPembayaran)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      idPM,
      proposalOpti,
      valOpti,
      startProgram,
      endProgram,
      placeProgram,
      idTypeTraining,
      idTypeProject,
      dokPendaftaran,
      terminPembayaran,
    ];
    await connection.query(query, params);
    return { idOpti };
  },

  async findAllPaginated(searchCriteria, limit, offset, user, program, status) {
    let baseQuery = `
      FROM opti o
      LEFT JOIN customer c ON o.idCustomer = c.idCustomer
      LEFT JOIN sumber s   ON o.idSumber   = s.idSumber
      LEFT JOIN expert e   ON o.idExpert   = e.idExpert
      LEFT JOIN sales  sl  ON o.idSales    = sl.idSales
    `;
    const params = [];
    const whereClauses = [];

    if (searchCriteria) {
      const { corpCustomer, nmOpti, nmSales } = searchCriteria;
      if (corpCustomer) {
        whereClauses.push(`c.corpCustomer LIKE ?`);
        params.push(`%${corpCustomer}%`);
      }
      if (nmOpti) {
        whereClauses.push(`o.nmOpti LIKE ?`);
        params.push(`%${nmOpti}%`);
      }
      if (nmSales) {
        whereClauses.push(`sl.nmSales LIKE ?`);
        params.push(`%${nmSales}%`);
      }
    }

    if (user && user.role === "Sales") {
      whereClauses.push(`o.idSales = ?`);
      params.push(user.id);
    }

    if (program && program !== "Semua Program") {
      whereClauses.push("o.jenisOpti = ?");
      params.push(program);
    }

    if (status) {
      whereClauses.push("o.statOpti = ?");
      params.push(status);
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

  async findAllForExport(searchCriteria, user, program, status) {
    let baseQuery = `
      FROM opti o
      LEFT JOIN customer c ON o.idCustomer = c.idCustomer
      LEFT JOIN sumber s   ON o.idSumber   = s.idSumber
      LEFT JOIN expert e   ON o.idExpert   = e.idExpert
      LEFT JOIN sales  sl  ON o.idSales    = sl.idSales
    `;
    const params = [];
    const whereClauses = [];

    if (searchCriteria) {
      const { corpCustomer, nmOpti, nmSales } = searchCriteria;
      if (corpCustomer) {
        whereClauses.push(`c.corpCustomer LIKE ?`);
        params.push(`%${corpCustomer}%`);
      }
      if (nmOpti) {
        whereClauses.push(`o.nmOpti LIKE ?`);
        params.push(`%${nmOpti}%`);
      }
      if (nmSales) {
        whereClauses.push(`sl.nmSales LIKE ?`);
        params.push(`%${nmSales}%`);
      }
    }

    if (user && user.role === "Sales") {
      whereClauses.push(`o.idSales = ?`);
      params.push(user.id);
    }
    if (program && program !== "Semua Program") {
      whereClauses.push("o.jenisOpti = ?");
      params.push(program);
    }
    if (status) {
      whereClauses.push("o.statOpti = ?");
      params.push(status);
    }
    if (whereClauses.length > 0) {
      baseQuery += ` WHERE ${whereClauses.join(" AND ")}`;
    }
    const dataQuery = `
      SELECT 
        o.nmOpti,
        o.mobileOpti,
        o.emailOpti,
        o.statOpti,
        DATE_FORMAT(o.datePropOpti, '%Y-%m-%d') AS datePropOpti,
        c.corpCustomer,
        s.nmSumber,
        sl.nmSales,
        o.jenisOpti,
        e.nmExpert,
        o.valOpti,
        DATE_FORMAT(o.startProgram, '%Y-%m-%d %H:%i:%s') AS startProgram,
        DATE_FORMAT(o.endProgram, '%Y-%m-%d %H:%i:%s') AS endProgram,
        o.placeProgram
      ${baseQuery} 
      ORDER BY o.idOpti DESC`;
    const [dataRows] = await pool.query(dataQuery, params);
    return dataRows;
  },

  async findSumberOptions() {
    const [rows] = await pool.query("SELECT idSumber, nmSumber FROM sumber");
    return rows;
  },

  async findById(idOpti, user) {
    // PERUBAHAN DIMULAI: Menambahkan LEFT JOIN ke tabel pm dan mengambil nmPM
    const query = `
      SELECT
        o.*, c.corpCustomer, s.nmSumber, e.nmExpert, sl.nmSales, p.nmPM
      FROM opti o
      LEFT JOIN customer     c  ON o.idCustomer = c.idCustomer
      LEFT JOIN sumber       s  ON o.idSumber   = s.idSumber
      LEFT JOIN sales        sl ON o.idSales    = sl.idSales
      LEFT JOIN expert       e  ON o.idExpert   = e.idExpert
      LEFT JOIN pm           p  ON o.idPM       = p.idPM
      WHERE o.idOpti = ?
      LIMIT 1
    `;
    // AKHIR PERUBAHAN

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
      idPM,
      proposalOpti,
      valOpti,
      startProgram,
      endProgram,
      placeProgram,
      idTypeTraining,
      idTypeProject,
      dokPendaftaran,
      terminPembayaran,
    } = optiData;
    const [result] = await connection.query(
      `UPDATE opti SET
         nmOpti = ?, contactOpti = ?, mobileOpti = ?, emailOpti = ?, statOpti = ?,
         datePropOpti = ?, idCustomer = ?, idSumber = ?, kebutuhan = ?,
         jenisOpti = ?, idExpert = ?, idPM = ?, proposalOpti = ?, valOpti = ?,
         startProgram = ?, endProgram = ?, placeProgram = ?, idTypeTraining = ?,
         idTypeProject = ?, dokPendaftaran = ? , terminPembayaran = ?
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
        idPM,
        proposalOpti,
        valOpti,
        startProgram,
        endProgram,
        placeProgram,
        idTypeTraining,
        idTypeProject,
        dokPendaftaran,
        terminPembayaran,
        idOpti,
      ]
    );
    return result.affectedRows;
  },

  async updatePaymentProof(idOpti, filename, connection = pool) {
    const query = `
      UPDATE opti
      SET dokPendaftaran = ?
      WHERE idOpti = ?
    `;
    const [result] = await connection.query(query, [filename, idOpti]);
    return result.affectedRows;
  },
};

module.exports = Opti;
