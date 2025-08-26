const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getOutsources } = require("../controllers/outsourceController");

router.get("/", authMiddleware(["Expert", "Admin", "Head Sales", "Sales"]), getOutsources);

module.exports = router;
