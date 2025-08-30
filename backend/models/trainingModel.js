// backend/models/trainingModel.js
const pool = require("../config/database");

// CREATE: wajib sertakan idOpti agar relasi terbentuk
async function createTraining(p) {
  const [r] = await pool.query(
    `INSERT INTO training
     (idTraining, idOpti, nmTraining, idTypeTraining, startTraining, endTraining,
      idExpert, placeTraining, examTraining, examDateTraining, idCustomer)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
      p.idTraining, p.idOpti, p.nmTraining, p.idTypeTraining, p.startTraining, p.endTraining,
      p.idExpert, p.placeTraining, p.examTraining, p.examDateTraining, p.idCustomer,
    ]
  );
  return r.insertId;
}

async function getAllTraining() {
  const [rows] = await pool.query(
    `SELECT tr.*, tt.nmTypeTraining
       FROM training tr
       LEFT JOIN typetraining tt ON tt.idTypeTraining = tr.idTypeTraining
     ORDER BY tr.startTraining DESC`
  );
  return rows;
}

// DETAIL by idTraining (JOIN ke opti supaya dapat statOpti & proposal)
async function getTrainingById(idTraining) {
  const [rows] = await pool.query(
    `SELECT 
        tr.*,
        tt.nmTypeTraining,
        o.statOpti,
        o.proposalOpti,
        c.corpCustomer
     FROM training tr
     LEFT JOIN typetraining tt ON tt.idTypeTraining = tr.idTypeTraining
     LEFT JOIN opti o          ON o.idOpti        = tr.idOpti
     LEFT JOIN customer c      ON c.idCustomer    = tr.idCustomer
     WHERE tr.idTraining = ?`,
    [idTraining]
  );
  return rows[0] || null;
}

async function updateTraining(idTraining, p) {
  const [r] = await pool.query(
    `UPDATE training SET
       idOpti = COALESCE(?, idOpti),
       nmTraining = COALESCE(?, nmTraining),
       idTypeTraining = COALESCE(?, idTypeTraining),
       startTraining = COALESCE(?, startTraining),
       endTraining = COALESCE(?, endTraining),
       idExpert = COALESCE(?, idExpert),
       placeTraining = COALESCE(?, placeTraining),
       examTraining = COALESCE(?, examTraining),
       examDateTraining = COALESCE(?, examDateTraining),
       idCustomer = COALESCE(?, idCustomer)
     WHERE idTraining = ?`,
    [
      p.idOpti ?? null, p.nmTraining ?? null, p.idTypeTraining ?? null,
      p.startTraining ?? null, p.endTraining ?? null,
      p.idExpert ?? null, p.placeTraining ?? null,
      p.examTraining ?? null, p.examDateTraining ?? null,
      p.idCustomer ?? null, idTraining,
    ]
  );
  return r.affectedRows;
}

async function deleteTraining(idTraining) {
  const [r] = await pool.query(
    `DELETE FROM training WHERE idTraining = ?`,
    [idTraining]
  );
  return r.affectedRows;
}

// LIST untuk expert login –> sertakan statOpti agar badge sama dgn Opportunity
async function getByExpertId(expertId) {
  const [rows] = await pool.query(
    `SELECT 
        tr.*,
        tt.nmTypeTraining,
        o.statOpti,
        o.nmOpti,
        c.corpCustomer
     FROM training tr
     LEFT JOIN typetraining tt ON tt.idTypeTraining = tr.idTypeTraining
     LEFT JOIN opti o          ON o.idOpti        = tr.idOpti
     LEFT JOIN customer c      ON c.idCustomer    = tr.idCustomer
     WHERE tr.idExpert = ?
     ORDER BY tr.startTraining DESC`,
    [expertId]
  );
  return rows;
}

// opsional helper
async function getByOptiIdWithType(idOpti) {
  const [rows] = await pool.query(
    `SELECT tr.*, tt.nmTypeTraining
       FROM training tr
       LEFT JOIN typetraining tt ON tt.idTypeTraining = tr.idTypeTraining
      WHERE tr.idOpti = ?
      LIMIT 1`,
    [idOpti]
  );
  return rows[0] || null;
}

module.exports = {
  createTraining,
  getAllTraining,
  getTrainingById,
  updateTraining,
  deleteTraining,
  getByExpertId,
  getByOptiIdWithType,
};
