// backend/controllers/userController.js
const pool = require("../config/database");

// New function to get all users from all role tables
const getAllUsers = async (req, res) => {
  try {
    // Query all tables in parallel
    const [adminPromise, salesPromise, expertPromise, akademikPromise, pmPromise] = [
      pool.query("SELECT idAdmin as id, nmAdmin as name, emailAdmin as email, 'Admin' as role FROM admin"),
      pool.query("SELECT idSales as id, nmSales as name, emailSales as email, role FROM sales"),
      pool.query("SELECT idExpert as id, nmExpert as name, emailExpert as email, role FROM expert"),
      pool.query("SELECT idAkademik as id, nmAkademik as name, emailAkademik as email, 'Akademik' as role FROM akademik"),
      pool.query("SELECT idPM as id, nmPM as name, emailPM as email, 'PM' as role FROM pm"),
    ];

    const [[admins], [sales], [experts], [akademiks], [pms]] = await Promise.all([
      adminPromise,
      salesPromise,
      expertPromise,
      akademikPromise,
      pmPromise,
    ]);

    // Combine all users into a single array
    const allUsers = [...admins, ...sales, ...experts, ...akademiks, ...pms];

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
    case 'Akademik':
      tableName = 'akademik';
      idColumn = 'idAkademik';
      break;
    case 'PM':
      tableName = 'pm';
      idColumn = 'idPM';
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


// Update user by role and id
const updateUserByRole = async (req, res) => {
  const { id, role } = req.params;
  const data = req.body;

  if (!id || !role) {
    return res.status(400).json({ error: "User ID and role are required." });
  }

  let tableName, idColumn, updateFields = [];

  // Check for password update
  if (data.password) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    updateFields.push(`password = '${hashedPassword}'`);
  }

  switch (role) {
    case 'Admin':
      tableName = 'admin';
      idColumn = 'idAdmin';
      if (data.name) updateFields.push(`nmAdmin = '${data.name}'`);
      if (data.email) updateFields.push(`emailAdmin = '${data.email}'`);
      if (data.mobile) updateFields.push(`mobileAdmin = '${data.mobile}'`);
      break;
    case 'Sales':
    case 'Head Sales':
      tableName = 'sales';
      idColumn = 'idSales';
      if (data.name) updateFields.push(`nmSales = '${data.name}'`);
      if (data.email) updateFields.push(`emailSales = '${data.email}'`);
      if (data.mobile) updateFields.push(`mobileSales = '${data.mobile}'`);
      if (data.role) updateFields.push(`role = '${data.role}'`);
      break;
    case 'Expert':
      tableName = 'expert';
      idColumn = 'idExpert';
      if (data.name) updateFields.push(`nmExpert = '${data.name}'`);
      if (data.email) updateFields.push(`emailExpert = '${data.email}'`);
      if (data.mobile) updateFields.push(`mobileExpert = '${data.mobile}'`);
      break;
    case 'Akademik':
      tableName = 'akademik';
      idColumn = 'idAkademik';
      if (data.name) updateFields.push(`nmAkademik = '${data.name}'`);
      if (data.email) updateFields.push(`emailAkademik = '${data.email}'`);
      if (data.mobile) updateFields.push(`mobileAkademik = '${data.mobile}'`);
      break;
    case 'PM':
      tableName = 'pm';
      idColumn = 'idPM';
      if (data.name) updateFields.push(`nmPM = '${data.name}'`);
      if (data.email) updateFields.push(`emailPM = '${data.email}'`);
      if (data.mobile) updateFields.push(`mobilePM = '${data.mobile}'`);
      break;
    default:
      return res.status(400).json({ error: "Invalid user role." });
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No valid fields to update." });
  }

  try {
    const [result] = await pool.query(
      `UPDATE ${tableName} SET ${updateFields.join(", ")} WHERE ${idColumn} = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(`Error updating user in ${tableName}:`, error);
    res.status(500).json({ error: `Server error while updating user.` });
  }
};

module.exports = { getAllUsers, deleteUserByRole, updateUserByRole };