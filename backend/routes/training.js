const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/trainingController");
const authMiddleware = require("../middleware/authMiddleware");

// GET all
router.get("/", authMiddleware(["Admin", "Expert"]), trainingController.getTraining);

// GET by ID
router.get("/:id", authMiddleware(["Admin", "Expert"]), trainingController.getTrainingById);

// CREATE
router.post("/", authMiddleware(["Admin"]), trainingController.createTraining);

// UPDATE
router.put("/:id", authMiddleware(["Admin"]), trainingController.updateTraining);

// DELETE
router.delete("/:id", authMiddleware(["Admin"]), trainingController.deleteTraining);

module.exports = router;
