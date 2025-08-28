// backend/routes/user.js 
const express = require("express");
const router = express.Router();
const { getAllUsers, deleteUserByRole, updateUserByRole } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all users from all tables
router.get("/all", authMiddleware(["Admin"]), getAllUsers);

// Update a user from a specific table based on role and id
router.put("/:role/:id", authMiddleware(["Admin"]), updateUserByRole);
// Delete a user from a specific table based on role and id
router.delete("/:role/:id", authMiddleware(["Admin"]), deleteUserByRole);

module.exports = router;