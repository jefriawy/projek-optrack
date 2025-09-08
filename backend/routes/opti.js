// backend/routes/opti.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createOpti,
  getOptis,
  getFormOptions,
  getOptiById,
  updateOpti,
  getSalesDashboardData,
} = require("../controllers/optiController");
const authMiddleware = require("../middleware/authMiddleware");

// Pastikan folder upload proposal ada
const proposalsDir = path.join(__dirname, "..", "uploads", "proposals");
if (!fs.existsSync(proposalsDir)) {
  fs.mkdirSync(proposalsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, proposalsDir);
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unik
  },
});
const upload = multer({ storage });

// Dashboard Sales
router.get(
  "/dashboard",
  authMiddleware(["Sales", "Admin", "Head Sales"]),
  getSalesDashboardData
);

// List Opti
router.get("/", authMiddleware(["Sales", "Admin", "Head Sales"]), getOptis);

// Create Opti (boleh Sales & Head Sales; Admin opsional kalau mau)
router.post(
  "/",
  authMiddleware(["Sales", "Head Sales", "Admin"]),
  upload.single("proposalOpti"),
  createOpti
);

// Form options
router.get(
  "/form-options",
  authMiddleware(["Sales", "Admin", "Head Sales"]),
  getFormOptions
);

// Detail Opti
router.get("/:id", authMiddleware(["Sales", "Admin", "Head Sales"]), getOptiById);

// Update Opti (perluas agar Admin juga bisa)
router.put(
  "/:id",
  authMiddleware(["Sales", "Head Sales", "Admin"]),
  upload.single("proposalOpti"),
  updateOpti
);

module.exports = router;
