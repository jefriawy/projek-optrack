// backend/routes/training.js
const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/trainingController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Konfigurasi Multer untuk mengelola unggahan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/feedback/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_dokumen_feedback_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Batas ukuran file 5MB
});

// khusus EXPERT: hanya training miliknya (Training Page)
// => izinkan juga Sales supaya user Sales dapat melihat daftar training terkait
router.get(
  "/mine",
  authMiddleware(["Expert", "Sales", "Head Sales", "Akademik", "Trainer"]),
  trainingController.getMyTrainings
);

// existing endpoints
router.get(
  "/",
  authMiddleware(["Admin", "Expert", "Akademik", "Trainer"]),
  trainingController.getTraining
);
router.get(
  "/:id",
  authMiddleware(["Admin", "Expert", "Sales", "Head Sales", "Akademik", "Trainer"]),
  trainingController.getTrainingById
);
router.post("/", authMiddleware(["Admin"]), trainingController.createTraining);
router.put(
  "/:id",
  authMiddleware(["Admin"]),
  trainingController.updateTraining
);
router.delete(
  "/:id",
  authMiddleware(["Admin"]),
  trainingController.deleteTraining
);

// Endpoint feedback dengan middleware Multer
router.put(
  "/:id/feedback",
  authMiddleware(["Admin", "Akademik"]),
  upload.array("attachments", 5), // Menerima hingga 5 file
  trainingController.submitTrainingFeedback
);

module.exports = router;