// backend/routes/expert.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getExperts,
  createExpertUser,
  updateExpertUser,
  getExpertById,
  getMyDashboardData,
  getHeadExpertDashboardData,
} = require("../controllers/expertController");
const { body, validationResult } = require("express-validator");

// --- PERUBAHAN VALIDASI ---
const validateExpertInput = (isUpdate = false) => [
  // Tambahkan parameter isUpdate
  body("nmExpert", "Expert name is required").notEmpty(),
  body("emailExpert", "Please include a valid email").isEmail(),

  // Password: Wajib saat create, Opsional saat update
  body("password")
    .if((value, { req }) => !isUpdate || (isUpdate && value)) // Jalankan validasi jika create ATAU jika update dan password diisi
    .isLength({ min: 6 })
    .withMessage("Password must be 6 or more characters"),

  body("role", "Role is required").isIn([
    "Expert",
    "Head of Expert",
    "Trainer",
  ]),
  body("skillCtgIds")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),
  body("skillCtgIds.*")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Each skill ID must be a positive integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Mengembalikan error validasi agar frontend bisa menampilkannya
      // return res.status(400).json({ errors: errors.array() });
      // Kirim format yang mungkin diharapkan frontend (berdasarkan log error)
      return res
        .status(400)
        .json({ error: "Validation failed", errors: errors.array() });
    }
    next();
  },
];
// --- AKHIR PERUBAHAN VALIDASI ---

// --- Routes ---
// Get all experts
router.get("/", authMiddleware(["Admin", "PM", "Head Sales"]), getExperts);

// Create new expert - Gunakan validasi tanpa flag 'isUpdate' (default: false)
router.post(
  "/",
  authMiddleware(["Admin"]),
  validateExpertInput(),
  createExpertUser
);

// Update expert - Gunakan validasi DENGAN flag 'isUpdate' true
router.put(
  "/:idExpert",
  authMiddleware(["Admin"]),
  validateExpertInput(true),
  updateExpertUser
); // Beri argumen 'true'

// Get expert by ID
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
