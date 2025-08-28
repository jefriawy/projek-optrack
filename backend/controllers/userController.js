// backend/controllers/userController.js
const pool = require("../config/database");

// New function to get all users from all role tables
const getAllUsers = async (req, res) => {
  try {
    // Query all tables in parallel
    const [adminPromise, salesPromise, expertPromise] = [
      pool.query("SELECT idAdmin as id, nmAdmin as name, emailAdmin as email, 'Admin' as role FROM admin"),
      pool.query("SELECT idSales as id, nmSales as name, emailSales as email, role FROM sales"),
      pool.query("SELECT idExpert as id, nmExpert as name, emailExpert as email, 'Expert' as role FROM expert"),
    ];

    const [[admins], [sales], [experts]] = await Promise.all([
      adminPromise,
      salesPromise,
      expertPromise,
    ]);

    // Combine all users into a single array
    const allUsers = [...admins, ...sales, ...experts];

    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Server error while fetching users." });
  }
};

// New function to delete a user from the correct table based on their role
const deleteUserByRole = async (req, res) => {
  const { id, role } = req.params;

  if (!id || !role) {
    return res.status(400).json({ error: "User ID and role are required." });
  }

  let tableName, idColumn;

  switch (role) {
    case 'Admin':
      tableName = 'admin';
      idColumn = 'idAdmin';
      break;
    case 'Sales':
    case 'Head Sales':
      tableName = 'sales';
      idColumn = 'idSales';
      break;
    case 'Expert':
      tableName = 'expert';
      idColumn = 'idExpert';
      break;
    default:
      return res.status(400).json({ error: "Invalid user role." });
  }

  try {
    const [result] = await pool.query(`DELETE FROM ${tableName} WHERE ${idColumn} = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(`Error deleting user from ${tableName}:`, error);
    res.status(500).json({ error: `Server error while deleting user.` });
  }
};


module.exports = { getAllUsers, deleteUserByRole };
