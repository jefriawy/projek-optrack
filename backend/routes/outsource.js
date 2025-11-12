
const express = require("express");
const router = express.Router();
const outsourceController = require("../controllers/outsourceController");
const authMiddleware = require("../middleware/authMiddleware");

// Endpoint untuk outsourcer melihat outsource yang diberikan ke dirinya
router.get(
  "/mine",
  authMiddleware(["Outsourcer", "external", "internal"]),
  outsourceController.getMyOutsources
);

router.get(
	"/",
	// Allow Outsourcer role so a logged-in outsourcer can fetch their assigned outsources
	authMiddleware(["Admin", "Expert", "Head Sales", "HR", "Sales", "Outsourcer"]),
	outsourceController.getOutsources
);
router.get(
	"/:id",
	authMiddleware(["Admin", "Expert", "Head Sales", "HR", "Sales"]),
	outsourceController.getOutsourceById
);
router.post("/", authMiddleware(["Admin"]), outsourceController.createOutsource);
router.put("/:id", authMiddleware(["Admin"]), outsourceController.updateOutsource);

// PUT /api/outsource/:outsourceId/outsourcers
router.put(
	"/:outsourceId/outsourcers",
	authMiddleware(["HR"]),
	outsourceController.updateOutsourceOutsourcers
);
router.delete("/:id", authMiddleware(["Admin"]), outsourceController.deleteOutsource);

module.exports = router;
