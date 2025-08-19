// backend/middleware/validateInput.js
const { body, validationResult } = require("express-validator");

const customerValidationRules = () => [
  body("nmCustomer").notEmpty().withMessage("Customer name is required"),
  body("emailCustomer").isEmail().withMessage("Invalid email format"),
  body("mobileCustomer")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("idStatCustomer").isInt().withMessage("Invalid status ID"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { customerValidationRules, validate };
