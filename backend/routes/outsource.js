const express = require("express");
const router = express.Router();
const outsourceController = require("../controllers/outsourceController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
	"/",
	authMiddleware(["Admin", "Expert", "Head Sales", "HR", "Sales"]),
	outsourceController.getOutsources
);
router.get(
	"/:id",
	authMiddleware(["Admin", "Expert", "Head Sales", "HR", "Sales"]),
	outsourceController.getOutsourceById
);
router.post("/", authMiddleware(["Admin"]), outsourceController.createOutsource);
router.put("/:id", authMiddleware(["Admin"]), outsourceController.updateOutsource);
router.delete("/:id", authMiddleware(["Admin"]), outsourceController.deleteOutsource);

module.exports = router;
