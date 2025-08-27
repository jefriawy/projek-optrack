const Training = require("../models/trainingModel");

const getTraining = async (req, res) => {
  try {
    const data = await Training.getAllTraining();
    res.json(data);
  } catch (err) {
    console.error("Error fetching training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

const createTraining = async (req, res) => {
  try {
    const id = await Training.createTraining(req.body);
    res.status(201).json({ message: "Training created", id });
  } catch (err) {
    console.error("Error creating training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

module.exports = {
  getTraining,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
};
