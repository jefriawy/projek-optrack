// backend/routes/customer.js
const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getStatusOptions,
  getCustomerById,
  updateCustomer,
} = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  customerValidationRules,
  validate,
} = require("../middleware/validateInput");

// Rute untuk mendapatkan opsi status (GET /api/customer/status)
router.get("/status", authMiddleware(["Sales", "Admin", "Head Sales"]), getStatusOptions);

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
router.get("/:id", authMiddleware(["Sales", "Admin", "Head Sales"]), getCustomerById);

// Rute untuk memperbarui customer berdasarkan ID (PUT /api/customer/:id)
router.put(
  "/:id",
  authMiddleware(["Sales", "Admin", "Head Sales"]),
  customerValidationRules(),
  validate,
  updateCustomer
);

module.exports = router;