// backend/controllers/userController.js
const User = require("../models/user");
const bcrypt = require("bcrypt");
const pool = require("../config/database");
const { generateUserId } = require("../utils/idGenerator");

const createUser = async (req, res) => {
  let connection;
  try {
    const {
      name,
      email,
      password,
      role,
      mobile,
      descSales,
      idSkill,
      statExpert,
      Row,
    } = req.body;
    console.log("Creating user:", { name, email, role, mobile });

    // Validate the role
    if (!["Sales", "Admin", "Expert", "Head Sales"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Check if the email is already in use
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Generate a new user ID
    const userId = await generateUserId(role);
    console.log("Generated new User ID:", userId);

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start a database transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Create the main user entry
    await User.create(
      { id: userId, name, email, password: hashedPassword, role, mobile },
      connection
    );
    console.log("User created with ID:", userId);

    // Conditional logic for specific roles
    if (role === "Sales" || role === "Head Sales") {
      const salesData = {
        nmSales: name,
        emailSales: email,
        mobileSales: mobile,
        userId,
      };
      if (descSales) {
        salesData.descSales = descSales;
      }
      const salesResult = await User.createSales(salesData, connection);
      console.log("Sales record created with idSales:", salesResult.insertId);
    } else if (role === "Expert") {
      const expertData = {
        nmExpert: name,
        emailExpert: email,
        mobileExpert: mobile,
        userId,
        idSkill,
        statExpert,
        Row,
      };
      const expertResult = await User.createExpert(expertData, connection);
      console.log(
        "Expert record created with idExpert:",
        expertResult.insertId
      );
    }

    // Commit the transaction if everything is successful
    await connection.commit();
    res.status(201).json({ message: "User created", id: userId });
  } catch (error) {
    // Roll back the transaction in case of an error
    if (connection) await connection.rollback();
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: error.sqlMessage || error.message || "Server error" });
  } finally {
    // Always release the connection back to the pool
    if (connection) connection.release();
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // --- CORRECTION AND ADDITION ---
    // Check the user's role and delete from the corresponding table
    if (user.role === "Sales" || user.role === "Head Sales") {
      await User.deleteSales(id, connection);
      console.log(`Deleted sales record for userId: ${id}`);
    } else if (user.role === "Expert") {
      // We need to add a deleteExpert function to the model first.
      // Assuming it exists, the call would be:
      await User.deleteExpert(id, connection); // You will need to create this function in user.js
      console.log(`Deleted expert record for userId: ${id}`);
    }
    // --- END OF CORRECTION ---

    // Finally, delete the main user entry
    await User.delete(id, connection);

    await connection.commit();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { createUser, getUsers, deleteUser };
