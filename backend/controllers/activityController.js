// backend/controllers/activityController.js
const activityModel = require("../models/activityModel");

async function getRecentActivities(req, res) {
  try {
    const activities = await activityModel.getRecentActivities();
    res.json(activities);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getRecentActivities,
};