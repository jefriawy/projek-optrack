// backend/controllers/trainingController.js
const Training = require("../models/trainingModel");

// GET /api/training  (Admin/Expert)
// Mengambil semua training (sudah ada)
const getTraining = async (_req, res) => {
  try {
    const data = await Training.getAllTraining();
    res.json(data);
  } catch (err) {
    console.error("Error fetching training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/training/:id  (Admin/Expert)
// Ambil training by id (sudah ada)
const getTrainingById = async (req, res) => {
  try {
    const training = await Training.getTrainingById(req.params.id);
    if (!training) {
      return res.status(404).json({ error: "Training not found" });
    }
    res.json(training);
  } catch (err) {
    console.error("Error fetching training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /api/training  (Admin)
// Buat training manual (sudah ada)
const createTraining = async (req, res) => {
  try {
    const id = await Training.createTraining(req.body);
    res.status(201).json({ message: "Training created", id });
  } catch (err) {
    console.error("Error creating training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT /api/training/:id  (Admin)
// Update training (sudah ada)
const updateTraining = async (req, res) => {
  try {
    const affectedRows = await Training.updateTraining(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Training not found" });
    }
    res.json({ message: "Training updated" });
  } catch (err) {
    console.error("Error updating training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE /api/training/:id  (Admin)
// Hapus training (sudah ada)
const deleteTraining = async (req, res) => {
  try {
    const affectedRows = await Training.deleteTraining(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Training not found" });
    }
    res.json({ message: "Training deleted" });
  } catch (err) {
    console.error("Error deleting training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ➕ NEW: GET /api/training/mine  (Expert)
// daftar training milik expert yang sedang login
const getMyTrainings = async (req, res) => {
  try {
    const expertId = req.user.id; // diisi oleh authMiddleware dari token login:contentReference[oaicite:2]{index=2}
    const data = await Training.getByExpertId(expertId);
    res.json(data);
  } catch (err) {
    console.error("Error fetching training for expert:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getTraining,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
  getMyTrainings, // export baru
};
