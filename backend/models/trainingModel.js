// backend/models/trainingModel.js

const pool = require("../config/database");

// CREATE: Modifikasi untuk menerima 'connection' opsional
async function createTraining(p, connection = pool) {
  const [r] = await connection.query(
    `INSERT INTO training
     (idTraining, idOpti, nmTraining, idTypeTraining, startTraining, endTraining,
      idExpert, placeTraining, examTraining, examDateTraining, idCustomer)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
      p.idTraining,
      p.idOpti,
      p.nmTraining,
      p.idTypeTraining,
      p.startTraining,
      p.endTraining,
      p.idExpert,
      p.placeTraining,
      p.examTraining,
      p.examDateTraining,
      p.idCustomer,
    ]
  );
  return r.insertId;
}

async function getAllTraining() {
  const [rows] = await pool.query(
    `SELECT tr.*, tt.nmTypeTraining, o.nmOpti, o.statOpti, s.nmSales, e.nmExpert, c.corpCustomer
       FROM training tr
       LEFT JOIN typetraining tt ON tt.idTypeTraining = tr.idTypeTraining
       LEFT JOIN opti o ON o.idOpti = tr.idOpti
       LEFT JOIN sales s ON s.idSales = o.idSales
       LEFT JOIN expert e ON e.idExpert = tr.idExpert
       LEFT JOIN customer c ON c.idCustomer = tr.idCustomer
     WHERE o.statOpti = 'Success'
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
        o.kebutuhan,
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
      p.idOpti ?? null,
      p.nmTraining ?? null,
      p.idTypeTraining ?? null,
      p.startTraining ?? null,
      p.endTraining ?? null,
      p.idExpert ?? null,
      p.placeTraining ?? null,
      p.examTraining ?? null,
      p.examDateTraining ?? null,
      p.idCustomer ?? null,
      idTraining,
    ]
  );
  return r.affectedRows;
}

async function deleteTraining(idTraining) {
  const [r] = await pool.query(`DELETE FROM training WHERE idTraining = ?`, [
    idTraining,
  ]);
  return r.affectedRows;
}

// ambil training berdasarkan idExpert (implementasi sudah dibutuhkan)
async function getByExpertId(expertId) {
  const [rows] = await pool.query(
    `SELECT 
        tr.*,
        tt.nmTypeTraining,
        o.statOpti,
        o.nmOpti,
        s.nmSales,  -- Add this line
        e.nmExpert, -- Add this line
        c.corpCustomer
     FROM training tr
     LEFT JOIN typetraining tt ON tt.idTypeTraining = tr.idTypeTraining
     LEFT JOIN opti o           ON o.idOpti        = tr.idOpti
     LEFT JOIN sales s          ON s.idSales       = o.idSales  -- Add this line
     LEFT JOIN expert e         ON e.idExpert      = tr.idExpert -- Add this line
     LEFT JOIN customer c       ON c.idCustomer    = tr.idCustomer
     WHERE tr.idExpert = ? AND o.statOpti = 'Success'
     ORDER BY tr.startTraining DESC`,
    [expertId]
  );
  return rows;
}

// ambil training berdasarkan idSales (via opti.idSales)
async function getBySalesId(salesId) {
  const [rows] = await pool.query(
    `SELECT 
        tr.*,
        tt.nmTypeTraining,
        o.statOpti,
        o.nmOpti,
        s.nmSales,
        e.nmExpert,
        c.corpCustomer
     FROM training tr
     LEFT JOIN typetraining tt ON tt.idTypeTraining = tr.idTypeTraining
     LEFT JOIN opti o           ON o.idOpti        = tr.idOpti
     LEFT JOIN sales s          ON s.idSales       = o.idSales
     LEFT JOIN expert e         ON e.idExpert      = tr.idExpert
     LEFT JOIN customer c       ON c.idCustomer    = tr.idCustomer
     WHERE o.idSales = ? AND o.statOpti = 'Success'
     ORDER BY tr.startTraining DESC`,
    [salesId]
  );
  return rows;
}

// NEW: ambil semua training untuk sebuah opti (dengan nama type)
async function getByOptiIdWithType(optiId) {
  const [rows] = await pool.query(
    `SELECT
       tr.*,
       tt.nmTypeTraining
     FROM training tr
     LEFT JOIN typetraining tt ON tt.idTypeTraining = tr.idTypeTraining
     WHERE tr.idOpti = ?
     ORDER BY tr.startTraining DESC`,
    [optiId]
  );
  return rows;
}

module.exports = {
  createTraining,
  getAllTraining,
  getTrainingById,
  updateTraining,
  deleteTraining,
  getByExpertId,
  getByOptiIdWithType,
  getBySalesId,
};
