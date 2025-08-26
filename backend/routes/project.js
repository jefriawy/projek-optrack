const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProjects, getProjectById } = require("../controllers/projectController");

router.get("/", authMiddleware(["Expert", "Admin", "Head Sales", "Sales"]), getProjects);
router.get("/:id", authMiddleware(["Expert", "Admin", "Head Sales", "Sales"]), getProjectById);

module.exports = router;
