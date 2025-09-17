// backend/models/activityModel.js
const pool = require("../config/database");

// Fungsi untuk mencatat aktivitas baru
async function createActivity(type, description, relatedId = null) {
  const [result] = await pool.query(
    `INSERT INTO recent_activities (type, description, related_id) VALUES (?, ?, ?)`,
    [type, description, relatedId]
  );
  return result.insertId;
}

// Fungsi untuk mendapatkan aktivitas terbaru
async function getRecentActivities() {
  const [rows] = await pool.query(
    `SELECT * FROM recent_activities ORDER BY timestamp DESC LIMIT 10`
  );
  return rows;
}

module.exports = {
  createActivity,
  getRecentActivities,
};