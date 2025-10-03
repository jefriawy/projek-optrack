// backend/models/trainingModel.js

const pool = require("../config/database");

// CREATE: Modifikasi untuk menerima 'connection' opsional
async function createTraining(p, connection = pool) {
  const [r] = await connection.query(
    `INSERT INTO training
     (idTraining, idOpti, nmTraining, idTypeTraining, startTraining, endTraining,
      idExpert, placeTraining, idCustomer)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      p.idTraining,
      p.idOpti,
      p.nmTraining,
      p.idTypeTraining,
      p.startTraining,
      p.endTraining,
      p.idExpert,
      p.placeTraining,
      p.idCustomer,
    ]
  );
  return r.insertId;
}

// Perbaikan: Parse fbAttachments setelah mengambil data
async function getAllTraining() {
  const [rows] = await pool.query(
    `SELECT tr.*, tt.nmTypeTraining, o.nmOpti, o.statOpti, s.nmSales, e.nmExpert, c.corpCustomer, tr.fbAttachments
       FROM training tr
       LEFT JOIN typetraining tt ON tt.idTypeTraining = tr.idTypeTraining
       LEFT JOIN opti o ON o.idOpti = tr.idOpti
       LEFT JOIN sales s ON s.idSales = o.idSales
       LEFT JOIN expert e ON e.idExpert = tr.idExpert
       LEFT JOIN customer c ON c.idCustomer = tr.idCustomer
     WHERE o.statOpti = 'po received'
     ORDER BY tr.startTraining DESC`
  );

  // Lakukan parsing JSON untuk setiap baris data yang diambil
  return rows.map(row => {
    if (row.fbAttachments) {
      try {
        row.fbAttachments = JSON.parse(row.fbAttachments);
      } catch (e) {
        console.error("Failed to parse fbAttachments JSON:", e);
        row.fbAttachments = null;
      }
    }
    return row;
  });
}

// Perbaikan: Parse fbAttachments setelah mengambil data
async function getTrainingById(idTraining) {
  const [rows] = await pool.query(
    `SELECT
        tr.*,
        tt.nmTypeTraining,
        o.statOpti,
        o.proposalOpti,
        o.kebutuhan,
        s.nmSales,
        e.nmExpert,
        c.corpCustomer,
        tr.fbAttachments
     FROM training tr
     LEFT JOIN typetraining tt ON tt.idTypeTraining = tr.idTypeTraining
     LEFT JOIN opti o          ON o.idOpti        = tr.idOpti
     LEFT JOIN sales s         ON s.idSales       = o.idSales
     LEFT JOIN expert e        ON e.idExpert      = tr.idExpert
     LEFT JOIN customer c      ON c.idCustomer    = tr.idCustomer
     WHERE tr.idTraining = ?`,
    [idTraining]
  );
  
  if (rows.length === 0) {
    return null;
  }

  const training = rows[0];
  // Lakukan parsing JSON untuk satu baris data
  if (training.fbAttachments) {
    try {
      training.fbAttachments = JSON.parse(training.fbAttachments);
    } catch (e) {
      console.error("Failed to parse fbAttachments JSON:", e);
      training.fbAttachments = null;
    }
  }

  return training;
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

// Perbaikan: Parse fbAttachments setelah mengambil data
async function getByExpertId(expertId) {
  const [rows] = await pool.query(
    `SELECT 
        tr.*,
        tt.nmTypeTraining,
        o.statOpti,
        o.nmOpti,
        s.nmSales,
        e.nmExpert,
        c.corpCustomer,
        tr.fbAttachments
     FROM training tr
     LEFT JOIN typetraining tt ON tt.idTypeTraining = tr.idTypeTraining
     LEFT JOIN opti o           ON o.idOpti        = tr.idOpti
     LEFT JOIN sales s          ON s.idSales       = o.idSales
     LEFT JOIN expert e         ON e.idExpert      = tr.idExpert
     LEFT JOIN customer c       ON c.idCustomer    = tr.idCustomer
     WHERE tr.idExpert = ? AND o.statOpti = 'po received'
     ORDER BY tr.startTraining DESC`,
    [expertId]
  );

  return rows.map(row => {
    if (row.fbAttachments) {
      try {
        row.fbAttachments = JSON.parse(row.fbAttachments);
      } catch (e) {
        console.error("Failed to parse fbAttachments JSON:", e);
        row.fbAttachments = null;
      }
    }
    return row;
  });
}

// Perbaikan: Parse fbAttachments setelah mengambil data
async function getBySalesId(salesId) {
  const [rows] = await pool.query(
    `SELECT 
        tr.*,
        tt.nmTypeTraining,
        o.statOpti,
        o.nmOpti,
        s.nmSales,
        e.nmExpert,
        c.corpCustomer,
        tr.fbAttachments
     FROM training tr
     LEFT JOIN typetraining tt ON tt.idTypeTraining = tr.idTypeTraining
     LEFT JOIN opti o           ON o.idOpti        = tr.idOpti
     LEFT JOIN sales s          ON s.idSales       = o.idSales
     LEFT JOIN expert e         ON e.idExpert      = tr.idExpert
     LEFT JOIN customer c       ON c.idCustomer    = tr.idCustomer
     WHERE o.idSales = ? AND o.statOpti = 'po received'
     ORDER BY tr.startTraining DESC`,
    [salesId]
  );
  
  return rows.map(row => {
    if (row.fbAttachments) {
      try {
        row.fbAttachments = JSON.parse(row.fbAttachments);
      } catch (e) {
        console.error("Failed to parse fbAttachments JSON:", e);
        row.fbAttachments = null;
      }
    }
    return row;
  });
}

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

async function updateFeedback(idTraining, feedback, attachments) {
  const [result] = await pool.query(
    `UPDATE training SET fbTraining = ?, fbAttachments = ? WHERE idTraining = ?`,
    [feedback, JSON.stringify(attachments), idTraining]
  );
  return result.affectedRows;
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
  updateFeedback,
};