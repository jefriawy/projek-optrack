const db = require("../config/database");

// Get all outsource (accept optional user to filter for HR)
const getAllOutsource = async (user) => {
  let sql = `
    SELECT o.*, op.nmOpti, op.statOpti, op.valOpti, op.kebutuhan, op.proposalOpti,
           c.corpCustomer, c.nmCustomer, s.nmSales, hr.nmHR, op.idHR
    FROM outsource o
    LEFT JOIN opti op ON o.idOpti = op.idOpti
    LEFT JOIN customer c ON op.idCustomer = c.idCustomer
    LEFT JOIN sales s ON op.idSales = s.idSales
    LEFT JOIN hr ON op.idHR = hr.idHR
    WHERE op.statOpti = 'po received'
  `;
  const params = [];
  if (user) {
    if (user.role === "HR") {
      sql += ` AND op.idHR = ?`;
      params.push(user.id);
    } else if (user.role === "Sales") {
      // Sales hanya boleh melihat outsource yang dia tambahkan (idSales di tabel opti)
      sql += ` AND op.idSales = ?`;
      params.push(user.id);
    }
    // Untuk role lain (Admin, Head Sales, Expert, PM) tidak ada filter tambahan
  }
  sql += ` ORDER BY o.startOutsource DESC`;

  const [rows] = await db.query(sql, params);
  return rows;
};

// Get outsource by ID
const getOutsourceById = async (id) => {
  const [rows] = await db.query("SELECT * FROM outsource WHERE idOutsource = ?", [id]);
  return rows[0];
};

// Create outsource
async function createOutsource(data) {
  const { idOutsource, nmOutsource /*, ... */ } = data;
  const query = `INSERT INTO outsource (idOutsource, nmOutsource /*, ... */) VALUES (?, ?)`;
  await pool.query(query, [idOutsource, nmOutsource]);
  return idOutsource;
}

// Update outsource
const updateOutsource = async (id, data) => {
  const {
    nmOutsource,
    idExpert,
    idCustomer,
    startOutsource,
    endOutsource,
    descriptionOutsource,
  } = data;

  const [result] = await db.query(
    `UPDATE outsource SET 
     nmOutsource=?, idExpert=?, idCustomer=?, startOutsource=?, endOutsource=?, descriptionOutsource=?
     WHERE idOutsource=?`,
    [nmOutsource, idExpert, idCustomer, startOutsource, endOutsource, descriptionOutsource, id]
  );

  return result.affectedRows;
};

// Delete outsource
const deleteOutsource = async (id) => {
  const [result] = await db.query("DELETE FROM outsource WHERE idOutsource = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAllOutsource,
  getOutsourceById,
  createOutsource,
  updateOutsource,
  deleteOutsource,
};
