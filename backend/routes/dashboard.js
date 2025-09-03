// backend/routes/dashboard.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getHeadSalesDashboardData } = require("../controllers/headSalesController");

// GET /api/dashboard/head-of-sales
router.get(
  "/head-of-sales",
  authMiddleware(["Head Sales", "Admin"]),
  getHeadSalesDashboardData
);

module.exports = router;
