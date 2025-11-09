// backend/routes/user.js 
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getAllUsers, deleteUserByRole, updateUserByRole, getPMs, createHRUser } = require("../controllers/userController");
// Tambah user HR
router.post("/hr", authMiddleware(["Admin"]), createHRUser);

// Get all users from all tables
router.get("/all", authMiddleware(["Admin"]), getAllUsers);

// Get all PMs
router.get("/pms", authMiddleware(["Admin", "Head Sales"]), getPMs);

// Update a user from a specific table based on role and id
router.put("/:role/:id", authMiddleware(["Admin"]), updateUserByRole);
// Delete a user from a specific table based on role and id
router.delete("/:role/:id", authMiddleware(["Admin"]), deleteUserByRole);

module.exports = router;