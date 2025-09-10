// backend/routes/project.js
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

// RUTE BARU: untuk mengambil project milik user yang login (Expert/Sales)
router.get(
  "/mine",
  authMiddleware(["Expert", "Sales", "Head Sales", "Head of Expert"]),
  projectController.getMyProjects
);

router.get(
  "/",
  authMiddleware(["Admin", "Expert", "Head of Expert"]),
  projectController.getProjects
);
router.get(
  "/:id",
  authMiddleware(["Admin", "Expert", "Sales", "Head Sales", "Head of Expert"]),
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
  authMiddleware(["Head of Expert"]),
  projectController.submitProjectFeedback
);

module.exports = router;
