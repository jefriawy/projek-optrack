// backend/routes/project.js
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
  authMiddleware(["Admin"]),
  projectController.submitProjectFeedback
);

router.put(
  "/:projectId/experts",
  authMiddleware(["Admin", "Head of Expert", "PM"]),
  projectController.updateProjectExperts
);

module.exports = router;
