// backend/routes/training.js
const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/trainingController");
const authMiddleware = require("../middleware/authMiddleware");

// khusus EXPERT: hanya training miliknya (Training Page)
// => izinkan juga Sales supaya user Sales dapat melihat daftar training terkait
router.get(
  "/mine",
  authMiddleware(["Expert", "Sales", "Head Sales", "Akademik"]),
  trainingController.getMyTrainings
);

// existing endpoints
router.get(
  "/",
  authMiddleware(["Admin", "Expert", "Akademik"]),
  trainingController.getTraining
);
router.get(
  "/:id",
  authMiddleware(["Admin", "Expert", "Sales", "Head Sales", "Akademik"]),
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

router.put(
  "/:id/feedback",
  authMiddleware(["Admin", "Akademik"]),
  trainingController.submitTrainingFeedback
);

module.exports = router;
