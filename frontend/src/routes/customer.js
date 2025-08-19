// frontend/src/routes/customer.js

const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getStatusOptions, // Anda tidak perlu mengimpor ini jika tidak digunakan.
  getCustomerById,
} = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  customerValidationRules,
  validate,
} = require("../middleware/validateInput");

router.post(
  "/",
  authMiddleware(["Sales"]),
  customerValidationRules(),
  validate,
  createCustomer
);
router.get("/", authMiddleware(["Sales", "Admin"]), getCustomers);
// Rute untuk detail pelanggan diletakkan setelah rute-rute lain.
router.get("/:id", authMiddleware(["Sales", "Admin"]), getCustomerById);

module.exports = router;