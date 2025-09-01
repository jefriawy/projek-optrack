// backend/routes/training.js
const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/trainingController");
const authMiddleware = require("../middleware/authMiddleware");

// khusus EXPERT: hanya training miliknya (Training Page)
// => izinkan juga Sales supaya user Sales dapat melihat daftar training terkait
router.get("/mine", authMiddleware(["Expert", "Sales"]), trainingController.getMyTrainings);

// existing endpoints
router.get("/", authMiddleware(["Admin", "Expert"]), trainingController.getTraining);
router.get("/:id", authMiddleware(["Admin", "Expert"]), trainingController.getTrainingById);
router.post("/", authMiddleware(["Admin"]), trainingController.createTraining);
router.put("/:id", authMiddleware(["Admin"]), trainingController.updateTraining);
router.delete("/:id", authMiddleware(["Admin"]), trainingController.deleteTraining);

module.exports = router;
