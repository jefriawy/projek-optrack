const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getTrainings, getTrainingById } = require("../controllers/trainingController");

// Akses untuk Expert, Admin, Head Sales, Sales (read-only)
router.get("/", authMiddleware(["Expert", "Admin", "Head Sales", "Sales"]), getTrainings);
router.get("/:id", authMiddleware(["Expert", "Admin", "Head Sales", "Sales"]), getTrainingById);

module.exports = router;
