// backend/routes/sales.js
const express = require("express");
const router = express.Router();
const { getSalesData } = require("../controllers/salesController");
const authMiddleware = require("../middleware/authMiddleware");

// Hanya Admin dan Head Sales yang bisa melihat laporan ini
router.get("/", authMiddleware(["Admin", "Head Sales"]), getSalesData);

module.exports = router;