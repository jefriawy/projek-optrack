const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const uploadExpertDocs = require("../middleware/uploadExpertDocs"); // Import Multer
const {
  getExperts,
  createExpertUser,
  updateExpertUser,
  getExpertById,
  getMyDashboardData,
  getHeadExpertDashboardData,
} = require("../controllers/expertController");
const { body, validationResult } = require("express-validator");

// --- MIDDLEWARE: Extract FormData fields dari array menjadi string ---
const extractFormDataFields = (req, res, next) => {
  if (req.body) {
    // Ekstrak field text dari array menjadi string
    req.body.nmExpert = Array.isArray(req.body.nmExpert) ? req.body.nmExpert[0] : req.body.nmExpert;
    req.body.emailExpert = Array.isArray(req.body.emailExpert) ? req.body.emailExpert[0] : req.body.emailExpert;
    req.body.password = Array.isArray(req.body.password) ? req.body.password[0] : req.body.password;
    req.body.mobileExpert = Array.isArray(req.body.mobileExpert) ? req.body.mobileExpert[0] : req.body.mobileExpert;
    req.body.statExpert = Array.isArray(req.body.statExpert) ? req.body.statExpert[0] : req.body.statExpert;
    req.body.Row = Array.isArray(req.body.Row) ? req.body.Row[0] : req.body.Row;
    req.body.role = Array.isArray(req.body.role) ? req.body.role[0] : req.body.role;
    req.body.expertSkills = Array.isArray(req.body.expertSkills) ? req.body.expertSkills[0] : req.body.expertSkills;
  }
  next();
};
// --- AKHIR MIDDLEWARE ---

// --- PERBAIKAN VALIDASI EXPERT (HANYA UNTUK FIELD UTAMA) ---
const validateExpertInput = (isUpdate = false) => [
  body("nmExpert", "Expert name is required").notEmpty(),
  body("emailExpert", "Please include a valid email").isEmail(),

  // Password: Wajib saat create, Opsional saat update
  body("password")
    .if((value, { req }) => !isUpdate || (isUpdate && value)) 
    .isLength({ min: 6 })
    .withMessage("Password must be 6 or more characters"),

  body("role", "Role is required").isIn([
    "Expert",
    "Head of Expert",
    "Trainer",
  ]),
  
  // HAPUS: Validasi lama untuk skillCtgIds yang berupa array.
  // Validasi expertSkills (JSON string) ditangani di controller.

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validation failed", errors: errors.array() });
    }
    next();
  },
];
// --- AKHIR PERBAIKAN VALIDASI ---

// --- Routes ---
// Get all experts
router.get("/", authMiddleware(["Admin", "PM", "Head Sales"]), getExperts);

// Create new expert - Menerima FormData dan File Upload
router.post(
  "/",
  authMiddleware(["Admin"]),
  // Multer harus dijalankan pertama untuk memproses FormData
  uploadExpertDocs.any(), // Menerima semua field dan file
  extractFormDataFields, // Ekstrak field dari array menjadi string
  validateExpertInput(), // Validasi dasar (Nama, Email, Password, Role)
  createExpertUser
);

// Update expert - Menerima FormData dan File Upload (sama seperti POST)
router.put(
  "/:idExpert",
  authMiddleware(["Admin"]),
  uploadExpertDocs.any(), // Menerima semua field dan file
  extractFormDataFields, // Ekstrak field dari array menjadi string
  validateExpertInput(true),
  updateExpertUser
);// Get expert by ID
router.get(
  "/:idExpert",
  authMiddleware(["Admin", "PM", "Head Sales"]),
  getExpertById
);

// Get dashboard for logged-in expert
router.get(
  "/my-dashboard",
  authMiddleware(["Expert", "Head of Expert", "Trainer"]),
  getMyDashboardData
);

// Get aggregated dashboard for Head of Expert
router.get(
  "/head-dashboard",
  authMiddleware(["Admin", "Head of Expert"]),
  getHeadExpertDashboardData
);

module.exports = router;