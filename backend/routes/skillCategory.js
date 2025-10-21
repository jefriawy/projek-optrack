// backend/routes/skillCategory.js
const express = require("express");
const router = express.Router();
// Import controller with new name
const {
  getSkillCategories,
} = require("../controllers/skillCategoryController");
const authMiddleware = require("../middleware/authMiddleware");

// Allow relevant roles to fetch categories (e.g., Admin for management, PM/Head Sales for assignment)
const allowedRoles = ["Admin", "PM", "Head Sales", "Expert"]; // Adjust roles as needed

router.get("/", authMiddleware(allowedRoles), getSkillCategories);

// Add routes for create/update/delete categories if implemented in controller/model

module.exports = router;
