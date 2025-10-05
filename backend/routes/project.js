// backend/routes/project.js
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Storage khusus untuk dokumen BAST
const bastDocsDir = path.join(__dirname, "..", "uploads", "bast_project");
if (!fs.existsSync(bastDocsDir)) {
  fs.mkdirSync(bastDocsDir, { recursive: true });
}
const bastStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, bastDocsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
const uploadBast = multer({ storage: bastStorage });

// Rute dokumen BAST
router.post(
  "/:id/bast",
  authMiddleware(["PM", "Admin"]),
  uploadBast.array("bast", 5),
  projectController.uploadBastDocument
);
router.get(
  "/:id/bast",
  authMiddleware(["PM", "Admin"]),
  projectController.getBastDocuments
);
router.delete(
  "/bast/:idDocument",
  authMiddleware(["PM", "Admin"]),
  projectController.deleteBastDocument
);

const projectDocsDir = path.join(
  __dirname,
  "..",
  "uploads",
  "project_documents"
);
if (!fs.existsSync(projectDocsDir)) {
  fs.mkdirSync(projectDocsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, projectDocsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage: storage });

// Konfigurasi Multer untuk feedback proyek
const feedbackProjectDir = path.join(__dirname, "..", "uploads", "feedback_project");
if (!fs.existsSync(feedbackProjectDir)) {
  fs.mkdirSync(feedbackProjectDir, { recursive: true });
}
const feedbackStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, feedbackProjectDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_feedback_project_" + file.originalname.replace(/\s+/g, "_"));
  },
});
const uploadFeedback = multer({ storage: feedbackStorage });

// Rute baru untuk dokumen
router.post(
  "/:id/documents",
  authMiddleware(["PM", "Expert", "Admin"]), // <-- Admin juga bisa upload
  upload.array("documents", 10),
  projectController.uploadProjectDocuments
);

router.get(
  "/:id/documents",
  authMiddleware(["PM", "Expert", "Admin", "Head Sales", "Sales"]),
  projectController.getProjectDocuments
);

router.delete(
  "/documents/:idDocument",
  authMiddleware(["PM", "Expert", "Admin"]),
  projectController.deleteProjectDocument
);

// RUTE BARU: untuk mengambil project milik user yang login (Expert/Sales/PM)
router.get(
  "/mine",
  authMiddleware(["Expert", "Sales", "Head Sales", "PM"]),
  projectController.getMyProjects
);

router.get(
  "/",
  authMiddleware(["Admin", "Expert"]),
  projectController.getProjects
);

router.get(
  "/:id",
  authMiddleware(["Admin", "Expert", "Sales", "Head Sales", "PM"]),
  projectController.getProjectById
);

router.post("/", authMiddleware(["Admin"]), projectController.createProject);

router.put("/:id", authMiddleware(["Admin"]), projectController.updateProject);

router.delete(
  "/:id",
  authMiddleware(["Admin"]),
  projectController.deleteProject
);

router.put(
  "/:id/feedback",
  authMiddleware(["PM"]), // Hanya PM yang bisa submit feedback
  uploadFeedback.array("attachments", 5), // Middleware untuk upload file
  projectController.submitProjectFeedback
);

router.put(
  "/:projectId/experts",
  authMiddleware(["Admin", "Head of Expert", "PM"]),
  projectController.updateProjectExperts
);

module.exports = router;
