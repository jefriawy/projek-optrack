// backend/controllers/notificationController.js
const Notification = require("../models/notificationModel");

// GET /api/notifications/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const count = await Notification.getUnreadCount(userId, role);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const notifications = await Notification.getNotifications(userId, role, 20); // Ambil 20 terbaru
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/notifications/mark-read
const markAsRead = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    await Notification.markAsRead(userId, role);
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getUnreadCount,
  getNotifications,
  markAsRead,
};