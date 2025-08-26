const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getExperts } = require("../controllers/expertController");

router.get("/", authMiddleware(["Expert", "Admin", "Head Sales", "Sales"]), getExperts);

module.exports = router;
