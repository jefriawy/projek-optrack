// backend/models/trainingModel.js
const db = require("../config/database");

// Get all training
const getAllTraining = async () => {
  const [rows] = await db.query("SELECT * FROM training");
  return rows;
};

// Get training by ID
const getTrainingById = async (id) => {
  const [rows] = await db.query("SELECT * FROM training WHERE idTraining = ?", [id]);
  return rows[0];
};

// Create training
async function createTraining(data) {
  const {
    idTraining,
    nmTraining,
    idTypeTraining = 1,
    startTraining = null,
    endTraining = null,
    idExpert = null,
    placeTraining = null,
    examTraining = 0,
    examDateTraining = null,
    idCustomer = null,
  } = data;

  const query = `INSERT INTO training
    (idTraining, nmTraining, idTypeTraining, startTraining, endTraining, idExpert, placeTraining, examTraining, examDateTraining, idCustomer)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [idTraining, nmTraining, idTypeTraining, startTraining, endTraining, idExpert, placeTraining, examTraining, examDateTraining, idCustomer];
  await pool.query(query, params);
  return idTraining;
}

// Update training
const updateTraining = async (id, data) => {
  const {
    nmTraining,
    idTypeTraining,
    startTraining,
    endTraining,
    idExpert,
    placeTraining,
    examTraining,
    examDateTraining,
    idCustomer,
  } = data;

  const [result] = await db.query(
    `UPDATE training SET 
      nmTraining=?, idTypeTraining=?, startTraining=?, endTraining=?, idExpert=?, 
      placeTraining=?, examTraining=?, examDateTraining=?, idCustomer=?
     WHERE idTraining=?`,
    [
      nmTraining,
      idTypeTraining,
      startTraining,
      endTraining,
      idExpert,
      placeTraining,
      examTraining,
      examDateTraining,
      idCustomer,
      id,
    ]
  );

  return result.affectedRows;
};

// Delete training
const deleteTraining = async (id) => {
  const [result] = await db.query("DELETE FROM training WHERE idTraining = ?", [id]);
  return result.affectedRows;
};

// ➕ NEW: Get all training owned by specific expert
const getByExpertId = async (idExpert) => {
  const [rows] = await db.query(
    `SELECT t.*, c.nmCustomer, c.corpCustomer
     FROM training t
     LEFT JOIN customer c ON t.idCustomer = c.idCustomer
     WHERE t.idExpert = ?
     ORDER BY COALESCE(t.startTraining, t.endTraining) ASC`,
    [idExpert]
  );
  return rows;
};

module.exports = {
  getAllTraining,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
  getByExpertId, // export baru
};
