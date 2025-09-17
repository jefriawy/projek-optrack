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
  uploadPaymentProof,
} = require("../controllers/optiController");
const authMiddleware = require("../middleware/authMiddleware");

// Pastikan folder upload ada
const proposalsDir = path.join(__dirname, "..", "uploads", "proposals");
const invoicesDir = path.join(__dirname, "..", "uploads", "invoice");
if (!fs.existsSync(proposalsDir)) {
  fs.mkdirSync(proposalsDir, { recursive: true });
}
if (!fs.existsSync(invoicesDir)) {
  fs.mkdirSync(invoicesDir, { recursive: true });
}

const proposalStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, proposalsDir);
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unik
  },
});

const paymentStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, invoicesDir);
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "_payment_" + file.originalname);
  },
});

const uploadProposal = multer({ storage: proposalStorage });
const uploadPayment = multer({ storage: paymentStorage });

/** 
 * Jalankan multer HANYA jika Content-Type multipart/form-data.
 * Kalau JSON biasa, langsung next() tanpa parse file.
 */
const maybeUpload = (req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (ct.includes("multipart/form-data")) {
    return uploadProposal.single("proposalOpti")(req, res, next);
  }
  return next();
};

// Dashboard Sales
router.get(
  "/dashboard",
  authMiddleware(["Sales", "Admin", "Head Sales"]),
  getSalesDashboardData
);

// List Opti
router.get("/", authMiddleware(["Sales", "Admin", "Head Sales"]), getOptis);

// Create Opti
router.post(
  "/",
  authMiddleware(["Sales", "Head Sales", "Admin"]),
  maybeUpload,
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

// Update Opti
router.put(
  "/:id",
  authMiddleware(["Sales", "Head Sales", "Admin"]),
  maybeUpload,
  updateOpti
);

// Upload Bukti Pembayaran
router.put(
  "/:id/payment",
  authMiddleware(["Sales", "Head Sales", "Admin"]),
  uploadPayment.single('buktiPembayaran'),
  uploadPaymentProof
);

module.exports = router;