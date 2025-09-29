// backend/models/notificationModel.js
const pool = require("../config/database");

const Notification = {
  
  async createNotification({
    recipientId,
    recipientRole,
    message,
    type,
    senderId = null,
    senderName = null,
    relatedEntityId = null,
  }) {
    // Jika recipientRole adalah 'Head Sales', kita tidak perlu recipientId spesifik.
    // Kita anggap notifikasi ditujukan ke semua user dengan role tersebut.
    // Jika ada banyak Head Sales, kita perlu logic tambahan untuk broadcast di sini, 
    // namun untuk saat ini, kita simpan satu record yang ditujukan ke role.
    const [result] = await pool.query(
      `INSERT INTO notification (recipient_user_id, recipient_role, sender_user_id, sender_name, message, type, related_entity_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        recipientId || 'ALL_ROLE', // Gunakan 'ALL_ROLE' jika broadcast ke role
        recipientRole,
        senderId,
        senderName,
        message,
        type,
        relatedEntityId,
      ]
    );
    return result.insertId;
  },

  async getUnreadCount(userId, role) {
    // Ambil notifikasi spesifik user ATAU notifikasi yang ditujukan ke SEMUA ROLE-nya
    const [rows] = await pool.query(
      `SELECT COUNT(id) as count 
       FROM notification 
       WHERE (recipient_user_id = ? OR (recipient_user_id = 'ALL_ROLE' AND recipient_role = ?)) 
       AND is_read = FALSE`,
      [userId, role]
    );
    return rows[0].count;
  },

  async getNotifications(userId, role, limit = 20) {
    // Ambil notifikasi spesifik user ATAU notifikasi yang ditujukan ke SEMUA ROLE-nya
    const [rows] = await pool.query(
      `SELECT * FROM notification 
       WHERE (recipient_user_id = ? OR (recipient_user_id = 'ALL_ROLE' AND recipient_role = ?)) 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [userId, role, limit]
    );
    return rows;
  },

  async markAsRead(userId, role) {
    // Tandai notifikasi spesifik user sebagai terbaca
    await pool.query(
      `UPDATE notification SET is_read = TRUE 
       WHERE recipient_user_id = ? AND is_read = FALSE`,
      [userId]
    );
    // Juga tandai notifikasi broadcast ke role sebagai terbaca
    await pool.query(
      `UPDATE notification SET is_read = TRUE 
       WHERE recipient_user_id = 'ALL_ROLE' AND recipient_role = ? AND is_read = FALSE`,
      [role]
    );
  },
};

module.exports = Notification;