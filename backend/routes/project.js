const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware(["Admin", "Expert"]), projectController.getProjects);
router.get("/:id", authMiddleware(["Admin", "Expert"]), projectController.getProjectById);
router.post("/", authMiddleware(["Admin"]), projectController.createProject);
router.put("/:id", authMiddleware(["Admin"]), projectController.updateProject);
router.delete("/:id", authMiddleware(["Admin"]), projectController.deleteProject);

module.exports = router;
