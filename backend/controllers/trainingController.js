// backend/controllers/trainingController.js
const Notification = require("../models/notificationModel");
const Training = require("../models/trainingModel");
const Activity = { create: async () => {} }; // noop stub to preserve existing calls
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

const getTrainingById = async (req, res) => {
  try {
    const training = await Training.getTrainingById(req.params.id);
    if (!training) return res.status(404).json({ error: "Training not found" });
    res.json(training);
  } catch (err) {
    console.error("Error fetching training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createTraining = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      idTraining: await generateUserId("Training"),
    };
    const id = await Training.createTraining(payload);

    // Mencatat aktivitas baru setelah training berhasil dibuat
    await Activity.create(
      "new_training",
      `Training baru: "${payload.nmTraining}"`,
      payload.idTraining
    );

    // Buat notifikasi untuk semua Akademik
    await Notification.createNotification({
      recipientRole: "Akademik",
      message: `Training baru "${payload.nmTraining}" telah dibuat`,
      type: "training_baru",
      relatedEntityId: payload.idTraining,
    });

    res.status(201).json({ message: "Training created", id });
  } catch (err) {
    console.error("Error creating training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTraining = async (req, res) => {
  try {
    // Ambil data training sebelum diupdate untuk membandingkan status
    const existingTraining = await Training.getTrainingById(req.params.id);
    if (!existingTraining) {
      return res.status(404).json({ error: "Training not found" });
    }
    
    const affectedRows = await Training.updateTraining(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Training not found" });
    }

    // Bandingkan status baru dengan status lama
    const newStatus = req.body.statOpti;
    // Cek apakah 'statOpti' ada di body dan berbeda dari status sebelumnya
    if (newStatus && newStatus !== existingTraining.statOpti) {
      await Activity.create(
        "status_update",
        `Status training "${existingTraining.nmTraining}" diubah menjadi ${newStatus}.`,
        existingTraining.idTraining
      );

      // Buat notifikasi untuk semua Akademik
      await Notification.createNotification({
        recipientRole: "Akademik",
        message: `Status training "${existingTraining.nmTraining}" diubah menjadi ${newStatus}`,
        type: "status_training",
        relatedEntityId: existingTraining.idTraining,
      });
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
    if (role === "Expert" || role === "Trainer") {
      data = await Training.getByExpertId(id);
    } else if (role === "Sales") {
      data = await Training.getBySalesId(id);
    } else if (
      role === "Head Sales" ||
      role === "Admin" ||
      role === "Akademik"
    ) {
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

const submitTrainingFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const existingTraining = await Training.getTrainingById(id);
    if (!existingTraining) {
      return res.status(404).json({ error: "Training not found" });
    }

    // Simpan array objek: { stored: file.filename, original: file.originalname }
    const attachments = req.files
      ? req.files.map(file => ({
          stored: file.filename,
          original: file.originalname,
        }))
      : [];

    if (feedback === undefined) {
      return res.status(400).json({ error: "Feedback content is required." });
    }

    const affectedRows = await Training.updateFeedback(id, feedback, attachments);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Training not found" });
    }

    // ...log aktivitas...

    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Error submitting training feedback:", err);
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
  submitTrainingFeedback,
};