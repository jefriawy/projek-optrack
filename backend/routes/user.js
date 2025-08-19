// backend/routes/user.js 
const express = require("express");
const router = express.Router();
const { createUser, getUsers, deleteUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");

const userValidationRules = () => [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["Sales", "Admin", "HC", "Expert", "Trainer", "Head Sales"])
    .withMessage("Invalid role"),
  body("mobileSales")
    .optional()
    .matches(/^\d*$/)
    .withMessage("Mobile Sales must be numeric"),
  body("descSales")
    .optional()
    .isString()
    .withMessage("Description Sales must be a string"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/",
  authMiddleware(["Admin"]),
  userValidationRules(),
  validate,
  createUser
);
router.get("/", authMiddleware(["Admin"]), getUsers);
router.delete("/:id", authMiddleware(["Admin"]), deleteUser);

module.exports = router;