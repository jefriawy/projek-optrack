// backend/routes/opti.js
const express = require("express");
const router = express.Router();
const {
  createOpti,
  getOptis,
  getFormOptions,
  getOptiById,
  updateOpti,
} = require("../controllers/optiController");
const authMiddleware = require("../middleware/authMiddleware");

// Rute untuk mendapatkan semua data Opti
router.get("/", authMiddleware(["Sales", "Admin", "Head Sales"]), getOptis);

// Rute untuk membuat Opti baru
router.post("/", authMiddleware(["Sales", "Head Sales"]), createOpti);

// Rute untuk mendapatkan data customer dan sumber untuk form
router.get("/form-options", authMiddleware(["Sales", "Admin", "Head Sales"]), getFormOptions);

// Rute baru untuk detail
router.get("/:id", authMiddleware(["Sales", "Admin", "Head Sales"]), getOptiById);

// Rute baru untuk update
router.put("/:id", authMiddleware(["Sales", "Head Sales"]), updateOpti);

module.exports = router;
