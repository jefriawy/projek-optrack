// backend/controllers/trainingController.js
const Training = require("../models/trainingModel");
const { generateUserId } = require("../utils/idGenerator");

const getTraining = async (_req, res) => {
  try {
    const data = await Training.getAllTraining();
    res.json(data);
  } catch (err) {
    console.error("Error fetching training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ====================== PERUBAHAN DI FUNGSI INI ======================
const getTrainingById = async (req, res) => {
  try {
    // Memanggil fungsi dari model yang query-nya sudah lengkap
    const training = await Training.getTrainingById(req.params.id);
    if (!training) return res.status(404).json({ error: "Training not found" });
    res.json(training);
  } catch (err) {
    console.error("Error fetching training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ====================== AKHIR PERUBAHAN ======================

const createTraining = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      idTraining: await generateUserId("Training"),
    };
    const id = await Training.createTraining(payload);
    res.status(201).json({ message: "Training created", id });
  } catch (err) {
    console.error("Error creating training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTraining = async (req, res) => {
  try {
    const affectedRows = await Training.updateTraining(req.params.id, req.body);
    if (affectedRows === 0)
      return res.status(404).json({ error: "Training not found" });
    res.json({ message: "Training updated" });
  } catch (err) {
    console.error("Error updating training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTraining = async (req, res) => {
  try {
    const affectedRows = await Training.deleteTraining(req.params.id);
    if (affectedRows === 0)
      return res.status(404).json({ error: "Training not found" });
    res.json({ message: "Training deleted" });
  } catch (err) {
    console.error("Error deleting training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMyTrainings = async (req, res) => {
  try {
    const { role, id } = req.user;
    let data;
    if (role === "Expert") {
      data = await Training.getByExpertId(id);
    } else if (role === "Sales") {
      data = await Training.getBySalesId(id);
    } else if (role === "Head Sales") {
      data = await Training.getAllTraining();
    } else {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching training for user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getTraining,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
  getMyTrainings,
};
