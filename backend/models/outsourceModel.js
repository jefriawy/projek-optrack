const db = require("../config/database");

// Get all outsource
const getAllOutsource = async () => {
  const [rows] = await db.query("SELECT * FROM outsource");
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
