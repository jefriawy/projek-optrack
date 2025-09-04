// backend/routes/project.js

const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

// RUTE BARU: untuk mengambil project milik user yang login (Expert/Sales)
router.get(
  "/mine",
  authMiddleware(["Expert", "Sales", "Head Sales"]),
  projectController.getMyProjects
);

router.get(
  "/",
  authMiddleware(["Admin", "Expert"]),
  projectController.getProjects
);
router.get(
  "/:id",
  authMiddleware(["Admin", "Expert", "Sales", "Head Sales"]),
  projectController.getProjectById
);
router.post("/", authMiddleware(["Admin"]), projectController.createProject);
router.put("/:id", authMiddleware(["Admin"]), projectController.updateProject);
router.delete(
  "/:id",
  authMiddleware(["Admin"]),
  projectController.deleteProject
);

module.exports = router;
