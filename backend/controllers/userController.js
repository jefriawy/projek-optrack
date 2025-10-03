// backend/controllers/userController.js
const pool = require("../config/database");
const bcrypt = require("bcrypt"); // Pastikan bcrypt di-import di atas

// Fungsi getAllUsers dan deleteUserByRole tidak berubah
const getAllUsers = async (req, res) => {
  try {
    const [
      adminPromise,
      salesPromise,
      expertPromise,
      akademikPromise,
      pmPromise,
    ] = [
      pool.query(
        "SELECT idAdmin, nmAdmin, emailAdmin, 'Admin' as role, mobileAdmin FROM admin"
      ),
      pool.query(
        "SELECT idSales, nmSales, emailSales, role, mobileSales FROM sales"
      ),
      pool.query(
        "SELECT idExpert, nmExpert, emailExpert, role, mobileExpert FROM expert"
      ),
      pool.query(
        "SELECT idAkademik, nmAkademik, emailAkademik, 'Akademik' as role, mobileAkademik FROM akademik"
      ),
      pool.query("SELECT idPM, nmPM, emailPM, 'PM' as role, mobilePM FROM pm"),
    ];
    const [[admins], [sales], [experts], [akademiks], [pms]] =
      await Promise.all([
        adminPromise,
        salesPromise,
        expertPromise,
        akademikPromise,
        pmPromise,
      ]);
    const allUsers = [
      ...admins.map((u) => ({
        ...u,
        id: u.idAdmin,
        name: u.nmAdmin,
        email: u.emailAdmin,
      })),
      ...sales.map((u) => ({
        ...u,
        id: u.idSales,
        name: u.nmSales,
        email: u.emailSales,
      })),
      ...experts.map((u) => ({
        ...u,
        id: u.idExpert,
        name: u.nmExpert,
        email: u.emailExpert,
      })),
      ...akademiks.map((u) => ({
        ...u,
        id: u.idAkademik,
        name: u.nmAkademik,
        email: u.emailAkademik,
      })),
      ...pms.map((u) => ({ ...u, id: u.idPM, name: u.nmPM, email: u.emailPM })),
    ];
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Server error while fetching users." });
  }
};

const deleteUserByRole = async (req, res) => {
  const { id, role } = req.params;
  if (!id || !role) {
    return res.status(400).json({ error: "User ID and role are required." });
  }

  let tableName, idColumn;

  switch (role) {
    case "Admin":
      tableName = "admin";
      idColumn = "idAdmin";
      break;
    case "Sales":
    case "Head Sales":
      tableName = "sales";
      idColumn = "idSales";
      break;
    case "Expert":
    case "Trainer":
      tableName = "expert";
      idColumn = "idExpert";
      break;
    case "Akademik":
      tableName = "akademik";
      idColumn = "idAkademik";
      break;
    case "PM":
      tableName = "pm";
      idColumn = "idPM";
      break;
    default:
      return res.status(400).json({ error: "Invalid user role." });
  }

  try {
    const [result] = await pool.query(
      `DELETE FROM ${tableName} WHERE ${idColumn} = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(`Error deleting user from ${tableName}:`, error);
    res.status(500).json({ error: `Server error while deleting user.` });
  }
};

// ==================== PERUBAHAN DIMULAI ====================
// Fungsi updateUserByRole ditulis ulang untuk keamanan dan fungsionalitas
const updateUserByRole = async (req, res) => {
  const { id, role } = req.params;
  const data = req.body;

  if (!id || !role) {
    return res.status(400).json({ error: "User ID and role are required." });
  }

  let tableName, idColumn;
  const setClauses = [];
  const params = [];

  // Check for password update first
  if (data.password) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    setClauses.push("password = ?");
    params.push(hashedPassword);
  }

  switch (role) {
    case "Admin":
      tableName = "admin";
      idColumn = "idAdmin";
      if (data.name) {
        setClauses.push("nmAdmin = ?");
        params.push(data.name);
      }
      if (data.email) {
        setClauses.push("emailAdmin = ?");
        params.push(data.email);
      }
      if (data.mobile) {
        setClauses.push("mobileAdmin = ?");
        params.push(data.mobile);
      }
      break;
    case "Sales":
    case "Head Sales":
      tableName = "sales";
      idColumn = "idSales";
      if (data.name) {
        setClauses.push("nmSales = ?");
        params.push(data.name);
      }
      if (data.email) {
        setClauses.push("emailSales = ?");
        params.push(data.email);
      }
      if (data.mobile) {
        setClauses.push("mobileSales = ?");
        params.push(data.mobile);
      }
      if (data.role) {
        setClauses.push("role = ?");
        params.push(data.role);
      }
      break;
    case "Expert":
    case "Trainer": // Menambahkan 'Trainer' karena mereka ada di tabel 'expert'
      tableName = "expert";
      idColumn = "idExpert";
      if (data.name) {
        setClauses.push("nmExpert = ?");
        params.push(data.name);
      }
      if (data.email) {
        setClauses.push("emailExpert = ?");
        params.push(data.email);
      }
      if (data.mobile) {
        setClauses.push("mobileExpert = ?");
        params.push(data.mobile);
      }
      if (data.role) {
        setClauses.push("role = ?");
        params.push(data.role);
      }
      break;
    case "Akademik":
      tableName = "akademik";
      idColumn = "idAkademik";
      if (data.name) {
        setClauses.push("nmAkademik = ?");
        params.push(data.name);
      }
      if (data.email) {
        setClauses.push("emailAkademik = ?");
        params.push(data.email);
      }
      if (data.mobile) {
        setClauses.push("mobileAkademik = ?");
        params.push(data.mobile);
      }
      break;
    case "PM":
      tableName = "pm";
      idColumn = "idPM";
      if (data.name) {
        setClauses.push("nmPM = ?");
        params.push(data.name);
      }
      if (data.email) {
        setClauses.push("emailPM = ?");
        params.push(data.email);
      }
      if (data.mobile) {
        setClauses.push("mobilePM = ?");
        params.push(data.mobile);
      }
      break;
    default:
      return res.status(400).json({ error: "Invalid user role." });
  }

  if (setClauses.length === 0) {
    return res.status(400).json({ error: "No valid fields to update." });
  }

  params.push(id); // Menambahkan ID untuk klausa WHERE di akhir

  const query = `UPDATE ${tableName} SET ${setClauses.join(
    ", "
  )} WHERE ${idColumn} = ?`;

  try {
    const [result] = await pool.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(`Error updating user in ${tableName}:`, error);
    res.status(500).json({ error: `Server error while updating user.` });
  }
};
// ==================== AKHIR PERUBAHAN ====================

const getPMs = async (req, res) => {
  try {
    const [pms] = await pool.query("SELECT idPM, nmPM FROM pm");
    res.json(pms);
  } catch (error) {
    console.error("Error fetching PMs:", error);
    res.status(500).json({ error: "Server error while fetching PMs." });
  }
};

module.exports = { getAllUsers, deleteUserByRole, updateUserByRole, getPMs };
