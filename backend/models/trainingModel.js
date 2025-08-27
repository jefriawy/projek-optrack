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
const createTraining = async (data) => {
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
    `INSERT INTO training 
     (nmTraining, idTypeTraining, startTraining, endTraining, idExpert, placeTraining, examTraining, examDateTraining, idCustomer)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    ]
  );

  return result.insertId;
};

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

module.exports = {
  getAllTraining,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
};
