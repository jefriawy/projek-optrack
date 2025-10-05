// ==================== BAST PROJECT DOCUMENT ====================
async function getBastDocuments(projectId) {
  const [rows] = await db.query(
    `SELECT * FROM bast_project_document WHERE idProject = ? ORDER BY uploadTimestamp DESC`,
    [projectId]
  );
  return rows;
}

const { generateBastDocumentId } = require("../utils/idGenerator");

async function insertBastDocument({ idProject, fileNameOriginal, fileNameStored, uploadedBy }) {
  const idDocument = await generateBastDocumentId();
  const [result] = await db.query(
    `INSERT INTO bast_project_document (idDocument, idProject, fileNameOriginal, fileNameStored, uploadedBy, uploadTimestamp) VALUES (?, ?, ?, ?, ?, NOW())`,
    [idDocument, idProject, fileNameOriginal, fileNameStored, uploadedBy]
  );
  return idDocument;
}

async function deleteBastDocument(idDocument) {
  const [rows] = await db.query(
    `SELECT fileNameStored FROM bast_project_document WHERE idDocument = ?`,
    [idDocument]
  );
  if (rows.length === 0) return false;
  const fileNameStored = rows[0].fileNameStored;
  await db.query(`DELETE FROM bast_project_document WHERE idDocument = ?`, [idDocument]);
  return fileNameStored;
}
// backend/models/projectModel.js

const db = require("../config/database");

const BASE_QUERY = `
  SELECT 
    p.*, 
    tp.nmTypeProject,
    o.nmOpti, 
    o.statOpti, 
    o.valOpti,
    s.nmSales, 
    c.corpCustomer,
    o.kebutuhan,
    o.proposalOpti,
    pm.nmPM,
    GROUP_CONCAT(e.nmExpert SEPARATOR ', ') AS nmExpert
  FROM project p
  LEFT JOIN typeproject tp ON tp.idTypeProject = p.idTypeProject
  LEFT JOIN opti o ON o.idOpti = p.idOpti
  LEFT JOIN sales s ON o.idSales = s.idSales
  LEFT JOIN customer c ON p.idCustomer = c.idCustomer
  LEFT JOIN pm pm ON pm.idPM = o.idPM
  LEFT JOIN project_expert pe ON p.idProject = pe.idProject
  LEFT JOIN expert e ON pe.idExpert = e.idExpert
`;

// Get all projects (untuk Admin)
const getAllProjects = async () => {
  const query = `
    ${BASE_QUERY}
    WHERE o.statOpti = 'po received'
    GROUP BY p.idProject
    ORDER BY p.startProject DESC
  `;
  const [rows] = await db.query(query);
  return rows;
};

// Get project by ID (sekarang menggunakan BASE_QUERY)
const getProjectById = async (id) => {
  const [projectRows] = await db.query(`
    SELECT 
      p.*, 
      tp.nmTypeProject,
      o.nmOpti, 
      o.statOpti, 
      o.valOpti,
      s.nmSales, 
      c.corpCustomer,
      o.kebutuhan,
      o.proposalOpti,
      pm.nmPM
    FROM project p
    LEFT JOIN typeproject tp ON tp.idTypeProject = p.idTypeProject
    LEFT JOIN opti o ON o.idOpti = p.idOpti
    LEFT JOIN sales s ON o.idSales = s.idSales
    LEFT JOIN customer c ON p.idCustomer = c.idCustomer
    LEFT JOIN pm pm ON pm.idPM = o.idPM
    WHERE p.idProject = ?
  `, [id]);

  if (projectRows.length === 0) {
    return null;
  }

  const project = projectRows[0];

  const [expertRows] = await db.query(`
    SELECT e.idExpert, e.nmExpert
    FROM expert e
    JOIN project_expert pe ON e.idExpert = pe.idExpert
    WHERE pe.idProject = ?
  `, [id]);

  project.experts = expertRows;

  return project;
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
    placeProject,
  } = data;
  const query = `INSERT INTO project 
    (idProject, nmProject, idTypeProject, startProject, endProject, idCustomer, idOpti, placeProject) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  await connection.query(query, [
    idProject,
    nmProject,
    idTypeProject,
    startProject,
    endProject,
    idCustomer,
    idOpti,
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
    placeProject,
    idCustomer,
  } = data;
  const [result] = await db.query(
    `UPDATE project SET 
     nmProject=?, idTypeProject=?, startProject=?, endProject=?, placeProject=?, idCustomer=?
     WHERE idProject=?`,
    [
      nmProject,
      idTypeProject,
      startProject,
      endProject,
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
  const query = `
    ${BASE_QUERY}
    WHERE pe.idExpert = ? AND o.statOpti = 'po received'
    GROUP BY p.idProject
    ORDER BY p.startProject DESC
  `;
  const [rows] = await db.query(query, [expertId]);
  return rows;
}

// Ambil project berdasarkan idSales (sekarang menggunakan BASE_QUERY)
async function getBySalesId(salesId) {
  const query = `
    ${BASE_QUERY}
    WHERE o.idSales = ? AND o.statOpti = 'po received'
    GROUP BY p.idProject
    ORDER BY p.startProject DESC
  `;
  const [rows] = await db.query(query, [salesId]);
  return rows;
}

// ==================== PERUBAHAN DIMULAI ====================
// Fungsi baru untuk mengambil project berdasarkan idPM
async function getByPmId(pmId) {
  const query = `
    ${BASE_QUERY}
    WHERE o.idPM = ?
    GROUP BY p.idProject
    ORDER BY p.startProject DESC
  `;
  const [rows] = await db.query(query, [pmId]);
  return rows;
}
// ==================== AKHIR PERUBAHAN ====================

async function updateFeedback(idProject, feedback, attachments) {
  const attachmentsJson = attachments.length > 0 ? JSON.stringify(attachments) : null;
  const [result] = await db.query(
    `UPDATE project SET fbProject = ?, fbAttachments = ? WHERE idProject = ?`,
    [feedback, attachmentsJson, idProject]
  );
  return result.affectedRows;
}

async function updateProjectExperts(projectId, expertIds) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Hapus semua expert yang ada untuk project ini
    await connection.query("DELETE FROM project_expert WHERE idProject = ?", [
      projectId,
    ]);

    // Jika ada expertIds baru, masukkan
    if (expertIds && expertIds.length > 0) {
      const values = expertIds.map((expertId) => [projectId, expertId]);
      await connection.query(
        "INSERT INTO project_expert (idProject, idExpert) VALUES ?",
        [values]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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
  updateProjectExperts,
  getBastDocuments,
  insertBastDocument,
  deleteBastDocument,
};
