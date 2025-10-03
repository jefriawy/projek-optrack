// backend/models/projectModel.js

const db = require("../config/database");

// Query dasar yang lengkap dengan semua JOIN yang dibutuhkan
const BASE_QUERY = `
  SELECT 
    p.*, 
    tp.nmTypeProject,
    o.nmOpti, 
    o.statOpti, 
    o.valOpti,
    s.nmSales, 
    e.nmExpert, 
    c.corpCustomer,
    o.kebutuhan,
    o.proposalOpti,
    pm.nmPM
  FROM project p
  LEFT JOIN typeproject tp ON tp.idTypeProject = p.idTypeProject
  LEFT JOIN opti o ON o.idOpti = p.idOpti
  LEFT JOIN sales s ON o.idSales = s.idSales
  LEFT JOIN expert e ON e.idExpert = p.idExpert
  LEFT JOIN customer c ON p.idCustomer = c.idCustomer
  LEFT JOIN pm pm ON pm.idPM = o.idPM
`;

// Get all projects (untuk Admin)
const getAllProjects = async () => {
  const [rows] = await db.query(
    `${BASE_QUERY} WHERE o.statOpti = 'po received' ORDER BY p.startProject DESC`
  );
  return rows;
};

// Get project by ID (sekarang menggunakan BASE_QUERY)
const getProjectById = async (id) => {
  const [rows] = await db.query(`${BASE_QUERY} WHERE p.idProject = ?`, [id]);
  return rows[0];
};

// Create project
async function createProject(data, connection = db) {
  const {
    idProject,
    nmProject,
    idTypeProject,
    startProject,
    endProject,
    idCustomer,
    idOpti,
    idExpert,
    placeProject,
  } = data;
  const query = `INSERT INTO project 
    (idProject, nmProject, idTypeProject, startProject, endProject, idCustomer, idOpti, idExpert, placeProject) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  await connection.query(query, [
    idProject,
    nmProject,
    idTypeProject,
    startProject,
    endProject,
    idCustomer,
    idOpti,
    idExpert,
    placeProject,
  ]);
  return idProject;
}

// Update project
const updateProject = async (id, data) => {
  const {
    nmProject,
    idTypeProject,
    startProject,
    endProject,
    idExpert,
    placeProject,
    idCustomer,
  } = data;
  const [result] = await db.query(
    `UPDATE project SET 
     nmProject=?, idTypeProject=?, startProject=?, endProject=?, idExpert=?, placeProject=?, idCustomer=?
     WHERE idProject=?`,
    [
      nmProject,
      idTypeProject,
      startProject,
      endProject,
      idExpert,
      placeProject,
      idCustomer,
      id,
    ]
  );
  return result.affectedRows;
};

// Delete project
const deleteProject = async (id) => {
  const [result] = await db.query("DELETE FROM project WHERE idProject = ?", [
    id,
  ]);
  return result.affectedRows;
};

// Ambil project berdasarkan idExpert (sekarang menggunakan BASE_QUERY)
async function getByExpertId(expertId) {
  const [rows] = await db.query(
    `${BASE_QUERY} WHERE p.idExpert = ? AND o.statOpti = 'po received' ORDER BY p.startProject DESC`,
    [expertId]
  );
  return rows;
}

// Ambil project berdasarkan idSales (sekarang menggunakan BASE_QUERY)
async function getBySalesId(salesId) {
  const [rows] = await db.query(
    `${BASE_QUERY} WHERE o.idSales = ? AND o.statOpti = 'po received' ORDER BY p.startProject DESC`,
    [salesId]
  );
  return rows;
}

// ==================== PERUBAHAN DIMULAI ====================
// Fungsi baru untuk mengambil project berdasarkan idPM
async function getByPmId(pmId) {
  const [rows] = await db.query(
    // Query ini mengambil project yang terhubung ke opti, lalu memfilter berdasarkan idPM di opti
    `${BASE_QUERY} WHERE o.idPM = ? ORDER BY p.startProject DESC`,
    [pmId]
  );
  return rows;
}
// ==================== AKHIR PERUBAHAN ====================

async function updateFeedback(idProject, feedback) {
  const [result] = await db.query(
    `UPDATE project SET fbProject = ? WHERE idProject = ?`,
    [feedback, idProject]
  );
  return result.affectedRows;
}

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getByExpertId,
  getBySalesId,
  getByPmId, // <-- Ekspor fungsi baru
  updateFeedback,
};
