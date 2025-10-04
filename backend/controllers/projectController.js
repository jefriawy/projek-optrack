// backend/controllers/projectController.js
const Project = require("../models/projectModel");
const { generateUserId } = require("../utils/idGenerator");
const pool = require("../config/database");
const fs = require("fs");
const path = require("path");

const getProjects = async (req, res) => {
  try {
    const data = await Project.getAllProjects();
    res.json(data);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getProjectById = async (req, res) => {
  try {
    const project = await Project.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const createProject = async (req, res) => {
  try {
    const payload = { ...req.body, idProject: await generateUserId("Project") };
    const id = await Project.createProject(payload);
    res.status(201).json({ message: "Project created", id });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateProject = async (req, res) => {
  try {
    const affectedRows = await Project.updateProject(req.params.id, req.body);
    if (affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project updated" });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteProject = async (req, res) => {
  try {
    const affectedRows = await Project.deleteProject(req.params.id);
    if (affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getMyProjects = async (req, res) => {
  try {
    const { role, id } = req.user;
    let data;
    if (role === "Expert") {
      data = await Project.getByExpertId(id);
    } else if (role === "Sales") {
      data = await Project.getBySalesId(id);
    } else if (role === "PM") {
      data = await Project.getByPmId(id);
    } else if (role === "Head Sales" || role === "Admin") {
      data = await Project.getAllProjects();
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized access for this route" });
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching projects for user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const submitProjectFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    if (feedback === undefined) {
      return res.status(400).json({ error: "Feedback content is required." });
    }
    const affectedRows = await Project.updateFeedback(id, feedback);
    if (affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Error submitting project feedback:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateProjectExperts = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { expertIds } = req.body;

    if (!Array.isArray(expertIds)) {
      return res.status(400).json({ error: "expertIds must be an array." });
    }
    await Project.updateProjectExperts(projectId, expertIds);
    res.json({ message: "Project experts updated successfully." });
  } catch (err) {
    console.error("Error updating project experts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const uploadProjectDocuments = async (req, res) => {
  const { id: idProject } = req.params;
  const { id: userId } = req.user;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Tidak ada file yang diunggah." });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const promises = req.files.map(async (file) => {
      const { filename: fileNameStored, originalname: fileNameOriginal } = file;

      // Hasilkan ID string dari generator
      const idString = await generateUserId("Document");
      // Ubah ke integer sesuai permintaan
      const idDocument = parseInt(idString, 10);

      return connection.query(
        "INSERT INTO project_document (idDocument, idProject, fileNameStored, fileNameOriginal, uploadedBy) VALUES (?, ?, ?, ?, ?)",
        [idDocument, idProject, fileNameStored, fileNameOriginal, userId]
      );
    });

    await Promise.all(promises);
    await connection.commit();
    res
      .status(201)
      .json({ message: `${req.files.length} file berhasil diunggah.` });
  } catch (err) {
    await connection.rollback();
    req.files.forEach((file) => {
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr)
          console.error("Gagal menghapus file saat rollback:", unlinkErr);
      });
    });
    console.error("Error uploading project documents:", err);
    res.status(500).json({ error: "Gagal menyimpan data dokumen." });
  } finally {
    connection.release();
  }
};

// Fungsi baru untuk mendapatkan daftar dokumen
const getProjectDocuments = async (req, res) => {
  const { id: idProject } = req.params;
  try {
    const [documents] = await pool.query(
      `SELECT pd.idDocument, pd.fileNameStored, pd.fileNameOriginal, pd.uploadTimestamp,
              COALESCE(pm.nmPM, exp.nmExpert, adm.nmAdmin, sl.nmSales) as uploadedByName
       FROM project_document pd
       LEFT JOIN pm ON pm.idPM = pd.uploadedBy
       LEFT JOIN expert exp ON exp.idExpert = pd.uploadedBy
       LEFT JOIN admin adm ON adm.idAdmin = pd.uploadedBy
       LEFT JOIN sales sl ON sl.idSales = pd.uploadedBy
       WHERE pd.idProject = ? 
       ORDER BY pd.uploadTimestamp DESC`,
      [idProject]
    );
    res.json(documents);
  } catch (err) {
    console.error("Error fetching project documents:", err);
    res.status(500).json({ error: "Gagal mengambil daftar dokumen." });
  }
};

// Fungsi baru untuk menghapus dokumen
const deleteProjectDocument = async (req, res) => {
  const { idDocument } = req.params;
  const { id: userId, role } = req.user;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [docs] = await connection.query(
      "SELECT * FROM project_document WHERE idDocument = ?",
      [idDocument]
    );
    if (docs.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Dokumen tidak ditemukan." });
    }
    const doc = docs[0];

    if (
      doc.uploadedBy !== String(userId) &&
      role !== "Admin" &&
      role !== "PM"
    ) {
      await connection.rollback();
      return res
        .status(403)
        .json({ error: "Anda tidak memiliki izin untuk menghapus file ini." });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "project_documents",
      doc.fileNameStored
    );

    // Hapus entri dari database terlebih dahulu
    await connection.query(
      "DELETE FROM project_document WHERE idDocument = ?",
      [idDocument]
    );

    // Kemudian hapus file fisik
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          // Log error tapi jangan gagalkan transaksi karena DB sudah berhasil
          console.error(
            "Gagal menghapus file fisik, tetapi data DB sudah dihapus:",
            unlinkErr
          );
        }
      });
    }

    await connection.commit();
    res.json({ message: "Dokumen berhasil dihapus." });
  } catch (err) {
    await connection.rollback();
    console.error("Error deleting project document:", err);
    res.status(500).json({ error: "Gagal menghapus dokumen." });
  } finally {
    connection.release();
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getMyProjects,
  submitProjectFeedback,
  updateProjectExperts,
  uploadProjectDocuments,
  getProjectDocuments,
  deleteProjectDocument,
};
