// backend/models/opti.js

const pool = require("../config/database");

const Opti = {
  // CREATE: Modifikasi untuk menerima 'connection' opsional
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
    } = optiData;
    const query = `
      INSERT INTO opti
      (idOpti, nmOpti, contactOpti, mobileOpti, emailOpti, statOpti, datePropOpti,
       idCustomer, idSumber, kebutuhan, idSales, jenisOpti, idExpert, proposalOpti)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    ];
    // Gunakan 'connection' (jika ada) atau 'pool' (default) untuk menjalankan query
    await connection.query(query, params);
    return { idOpti };
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

    // Filter berdasarkan role
    if (user && user.role === "Sales") {
      whereClauses.push(`o.idSales = ?`);
      params.push(user.id);
    } else if (user && user.role === "Head Sales") {
      // Head Sales melihat semua opportunity dari timnya
      const [teamMembers] = await pool.query(
        "SELECT idSales FROM sales WHERE idHeadSales = ?",
        [user.id]
      );
      const teamMemberIds = teamMembers.map(tm => tm.idSales);
      if (teamMemberIds.length > 0) {
        // Termasuk opportunity milik Head Sales itu sendiri
        const allIds = [user.id, ...teamMemberIds];
        whereClauses.push(`o.idSales IN (?`);
        params.push(allIds);
      } else {
        // Jika tidak punya tim, hanya lihat miliknya sendiri
        whereClauses.push(`o.idSales = ?`);
        params.push(user.id);
      }
    }
    // Admin bisa melihat semua

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
      LIMIT ?
      OFFSET ?
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
  async findById(idOpti, user) {
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
    const opti = rows[0];

    if (!opti) return null;

    // Otorisasi: Cek apakah user boleh melihat data ini
    if (user.role === 'Sales' && opti.idSales !== user.id) {
      return null; // Sales hanya bisa lihat miliknya
    }
    if (user.role === 'Head Sales') {
      const [teamMembers] = await pool.query(
        "SELECT idSales FROM sales WHERE idHeadSales = ?",
        [user.id]
      );
      const teamMemberIds = teamMembers.map(tm => tm.idSales);
      // Head Sales bisa lihat miliknya atau timnya
      if (opti.idSales !== user.id && !teamMemberIds.includes(opti.idSales)) {
        return null;
      }
    }
    // Admin bisa lihat semua

    return opti;
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
        idOpti,
      ]
    );
    return result.affectedRows;
  },
};

module.exports = Opti;
