// backend/routes/activity.js
const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");

// Endpoint untuk mendapatkan aktivitas terbaru
router.get(
  "/recent",
  authMiddleware(["Admin", "Akademik"]),
  activityController.getRecentActivities
);

module.exports = router;