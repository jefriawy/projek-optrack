<<<<<<< HEAD
=======
// backend/routes/project.js

>>>>>>> b18d9e0269d772b95f0f608813932d02cf2334f8
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

<<<<<<< HEAD
router.get("/", authMiddleware(["Admin", "Expert"]), projectController.getProjects);
router.get("/:id", authMiddleware(["Admin", "Expert"]), projectController.getProjectById);
router.post("/", authMiddleware(["Admin"]), projectController.createProject);
router.put("/:id", authMiddleware(["Admin"]), projectController.updateProject);
router.delete("/:id", authMiddleware(["Admin"]), projectController.deleteProject);
=======
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
>>>>>>> b18d9e0269d772b95f0f608813932d02cf2334f8

module.exports = router;
