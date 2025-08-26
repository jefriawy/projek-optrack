// backend/routes/opti.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createOpti,
  getOptis,
  getFormOptions,
  getOptiById,
  updateOpti,
} = require("../controllers/optiController");
const authMiddleware = require("../middleware/authMiddleware");

// Konfigurasi Multer untuk upload proposal
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/proposals/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  },
});

const upload = multer({ storage: storage });

// Rute untuk mendapatkan semua data Opti
router.get("/", authMiddleware(["Sales", "Admin", "Head Sales"]), getOptis);

// Rute untuk membuat Opti baru dengan upload proposal
router.post(
  "/",
  authMiddleware(["Sales", "Head Sales"]),
  upload.single("proposalOpti"),
  createOpti
);

// Rute untuk mendapatkan data customer dan sumber untuk form
router.get("/form-options", authMiddleware(["Sales", "Admin", "Head Sales"]), getFormOptions);

// Rute baru untuk detail
router.get("/:id", authMiddleware(["Sales", "Admin", "Head Sales"]), getOptiById);

// Rute baru untuk update
router.put("/:id", authMiddleware(["Sales", "Head Sales"]), upload.single("proposalOpti"), updateOpti);

module.exports = router;