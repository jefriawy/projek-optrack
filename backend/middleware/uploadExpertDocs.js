// backend/middleware/uploadExpertDocs.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads", "certificate_expert");

// Pastikan direktori ada
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Path: backend/uploads/certificate_expert
  },
  filename: (req, file, cb) => {
    // Membuat nama file unik: expertID_skillID_timestamp.ext
    // Karena idExpert belum tersedia di req.body saat Multer dijalankan, 
    // kita akan gunakan ID sementara/timestamp dan akan rename di controller
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// Filter file (opsional, tapi disarankan)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Tipe file tidak didukung. Hanya gambar dan PDF.'), false);
  }
};

const uploadExpertDocs = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Batas 5MB
});

module.exports = uploadExpertDocs;