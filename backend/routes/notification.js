// backend/routes/notification.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

// Semua role berhak melihat notifikasi
const allRoles = ["Sales", "Head Sales", "Trainer", "Expert", "Admin", "Akademik", "PM"];

router.get("/unread-count", authMiddleware(allRoles), notificationController.getUnreadCount);
router.get("/", authMiddleware(allRoles), notificationController.getNotifications);
router.put("/mark-read", authMiddleware(allRoles), notificationController.markAsRead);

module.exports = router;