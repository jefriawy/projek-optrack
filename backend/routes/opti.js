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

<<<<<<< HEAD
// Konfigurasi Multer untuk upload proposal
// Pastikan folder target ada dan gunakan path absolut berbasis __dirname
=======
// Pastikan folder upload proposal ada
>>>>>>> b18d9e0269d772b95f0f608813932d02cf2334f8
const proposalsDir = path.join(__dirname, "..", "uploads", "proposals");
if (!fs.existsSync(proposalsDir)) {
  fs.mkdirSync(proposalsDir, { recursive: true });
}

const storage = multer.diskStorage({
<<<<<<< HEAD
  destination: function (req, file, cb) {
    cb(null, proposalsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  },
});

const upload = multer({ storage: storage });

// Rute untuk dasbor sales
router.get("/dashboard", authMiddleware(["Sales", "Admin", "Head Sales"]), getSalesDashboardData);

// Rute untuk mendapatkan semua data Opti
router.get("/", authMiddleware(["Sales", "Admin", "Head Sales"]), getOptis);

// Rute untuk membuat Opti baru dengan upload proposal
router.post(
  "/",
  authMiddleware(["Sales", "Head Sales"]),
=======
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
>>>>>>> b18d9e0269d772b95f0f608813932d02cf2334f8
  upload.single("proposalOpti"),
  createOpti
);

<<<<<<< HEAD
// Rute untuk mendapatkan data customer dan sumber untuk form
router.get("/form-options", authMiddleware(["Sales", "Admin", "Head Sales"]), getFormOptions);

// Rute baru untuk detail
router.get("/:id", authMiddleware(["Sales", "Admin", "Head Sales"]), getOptiById);

// Rute baru untuk update
router.put("/:id", authMiddleware(["Sales", "Head Sales"]), upload.single("proposalOpti"), updateOpti);

module.exports = router;
=======
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
>>>>>>> b18d9e0269d772b95f0f608813932d02cf2334f8
