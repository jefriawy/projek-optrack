// backend/routes/customer.js
const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getStatusOptions,
  getCustomerById,
  updateCustomer,
  updateCustomerStatus, // <-- Impor fungsi baru
} = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  customerValidationRules,
  validate,
} = require("../middleware/validateInput");

// Rute untuk mendapatkan opsi status (GET /api/customer/status)
router.get(
  "/status",
  authMiddleware(["Sales", "Admin", "Head Sales"]),
  getStatusOptions
);

// Rute untuk mendapatkan semua customer (GET /api/customer)
router.get("/", authMiddleware(["Sales", "Admin", "Head Sales"]), getCustomers);

// Rute untuk membuat customer (POST /api/customer)
router.post(
  "/",
  authMiddleware(["Sales", "Head Sales"]),
  customerValidationRules(),
  validate,
  createCustomer
);

// Rute untuk mendapatkan detail customer berdasarkan ID (GET /api/customer/:id)
router.get(
  "/:id",
  authMiddleware(["Sales", "Admin", "Head Sales"]),
  getCustomerById
);

// --- TAMBAHAN: Rute baru khusus untuk update status ---
router.put(
  "/:id/status",
  authMiddleware(["Admin", "Head Sales"]), // Hanya Admin & Head Sales yang bisa
  updateCustomerStatus
);
// --- AKHIR TAMBAHAN ---

// Rute untuk memperbarui seluruh data customer berdasarkan ID (PUT /api/customer/:id)
router.put(
  "/:id",
  authMiddleware(["Sales", "Admin", "Head Sales"]),
  customerValidationRules(),
  validate,
  updateCustomer
);

module.exports = router;
