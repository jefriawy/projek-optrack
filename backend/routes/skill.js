// backend/routes/skill.js

const express = require("express");
const router = express.Router();
const { getSkills } = require("../controllers/skillController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware(["Admin"]), getSkills);

module.exports = router;
