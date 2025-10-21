// backend/controllers/skillCategoryController.js (MODIFIKASI)
const SkillCategory = require("../models/skillCategoryModel");
const { validationResult } = require("express-validator");
const pool = require("../config/database"); 

const getSkillCategories = async (req, res) => {
  try {
    const categories = await SkillCategory.findAll();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching skill categories:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// FUNGSI BARU: Membuat kategori skill baru
const createSkillCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nmSkillCtg, descSkillCtg, statSkillCtg } = req.body;

    if (!nmSkillCtg) {
        return res.status(400).json({ error: "Nama Kategori (nmSkillCtg) wajib diisi." });
    }
    
    try {
        // Cek duplikasi nama kategori
        const [existingCategory] = await pool.query(
            "SELECT idSkillCtg FROM skill_category WHERE nmSkillCtg = ?",
            [nmSkillCtg]
        );

        if (existingCategory.length > 0) {
            return res.status(400).json({ error: `Kategori skill '${nmSkillCtg}' sudah ada.` });
        }

        const newCategoryData = {
            nmSkillCtg,
            descSkillCtg,
            statSkillCtg: statSkillCtg || 'Active',
        };

        const result = await SkillCategory.create(newCategoryData);
        
        res.status(201).json({ 
            message: "Kategori skill berhasil ditambahkan.", 
            id: result.insertId 
        });

    } catch (error) {
        console.error("Error creating skill category:", error);
        res.status(500).json({ error: "Server error saat membuat kategori skill." });
    }
};

module.exports = { getSkillCategories, createSkillCategory };