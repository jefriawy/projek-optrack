// backend/controllers/skillCategoryController.js
const SkillCategory = require("../models/skillCategoryModel"); // Use the new model

const getSkillCategories = async (req, res) => {
  try {
    // Assuming user must be logged in, roles might vary (Admin, PM, etc.)
    const categories = await SkillCategory.findAll();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching skill categories:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Add functions for create, update, delete categories if needed

module.exports = { getSkillCategories };
