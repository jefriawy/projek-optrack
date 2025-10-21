// backend/routes/skillCategory.js (MODIFIKASI)
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getSkillCategories,
  createSkillCategory, 
} = require("../controllers/skillCategoryController");
const authMiddleware = require("../middleware/authMiddleware");

const getAllowedRoles = ["Admin", "PM", "Head Sales", "Expert", "Head of Expert"]; 

const validateCreateCategory = [
    body("nmSkillCtg", "Nama kategori wajib diisi").notEmpty(),
    body("statSkillCtg", "Status harus 'Active' atau 'Inactive'").optional().isIn(['Active', 'Inactive']),
];

// @route   GET /api/skill-categories
// @desc    Mendapatkan semua kategori skill
router.get("/", authMiddleware(getAllowedRoles), getSkillCategories);

// @route   POST /api/skill-categories (BARU)
// @desc    Menambahkan kategori skill baru (Hanya Admin)
router.post(
    "/", 
    authMiddleware(["Admin"]), 
    validateCreateCategory, 
    createSkillCategory
);

module.exports = router;
