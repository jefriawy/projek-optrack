const Expert = require("../models/expert");
const bcrypt = require("bcrypt");
const { generateUserId } = require("../utils/idGenerator");
const pool = require('../config/database'); // Pastikan path ini benar

/**
 * @desc    Mengambil semua data expert
 * @route   GET /api/expert
 * @access  Private (Admin)
 */
const getExperts = async (_req, res) => {
  try {
    const experts = await Expert.findAll();
    res.json(experts);
  } catch (err) {
    console.error("getExperts error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc    Membuat user expert baru
 * @route   POST /api/expert
 * @access  Private (Admin)
 */
const createExpertUser = async (req, res) => {
  console.log("Attempting to create expert with data:", req.body);
  const { nmExpert, emailExpert, password, mobileExpert, idSkill, statExpert, Row } = req.body;

  if (!nmExpert || !emailExpert || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    const existingUser = await Expert.findByEmail(emailExpert);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }
    const newExpertId = await generateUserId('Expert');
    const hashedPassword = await bcrypt.hash(password, 10);
    await Expert.create({
      idExpert: newExpertId,
      nmExpert,
      emailExpert,
      password: hashedPassword,
      mobileExpert,
      idSkill,
      statExpert,
      Row,
    });
    res.status(201).json({ message: "Expert user created successfully", idExpert: newExpertId });
  } catch (error) {
    console.error("Error creating expert user:", error.message);
    res.status(500).json({ error: "Server error while creating expert user.", details: error.sqlMessage });
  }
};

/**
 * @desc    Mengambil data dashboard untuk expert yang sedang login
 * @route   GET /api/expert/my-dashboard
 * @access  Private (Expert)
 */
const getMyDashboardData = async (req, res) => {
  const idExpert = req.user.id; 

  if (!idExpert) {
    return res.status(400).json({ error: 'Expert ID tidak ditemukan dari token.' });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Query untuk totals tidak berubah
    const [trainingCount] = await connection.query('SELECT COUNT(*) as count FROM training WHERE idExpert = ?', [idExpert]);
    const [projectCount] = await connection.query('SELECT COUNT(*) as count FROM project WHERE idExpert = ?', [idExpert]);
    const [outsourceCount] = await connection.query('SELECT COUNT(*) as count FROM outsource');

    const totals = {
      training: trainingCount[0].count,
      project: projectCount[0].count,
      outsource: outsourceCount[0].count,
    };

    // Query untuk activities kini DITAMBAH dengan startDate
    const [activities] = await connection.query(`
      SELECT 
        'Training' as type, 
        t.idTraining as id,
        t.nmTraining as name, 
        o.statOpti as status,
        t.startTraining as startDate,
        t.endTraining as endDate, 
        c.nmCustomer as customerName,
        tt.nmTypeTraining as trainingType
      FROM training t
      LEFT JOIN opti o ON t.idOpti = o.idOpti
      LEFT JOIN customer c ON t.idCustomer = c.idCustomer
      LEFT JOIN typetraining tt ON t.idTypeTraining = tt.idTypeTraining
      WHERE t.idExpert = ?
      
      UNION ALL
      
      SELECT 
        'Project' as type, 
        p.idProject as id,
        p.nmProject as name, 
        o.statOpti as status,
        p.startProject as startDate,
        p.endProject as endDate, 
        c.nmCustomer as customerName,
        NULL as trainingType
      FROM project p
      LEFT JOIN opti o ON p.idOpti = o.idOpti
      LEFT JOIN customer c ON p.idCustomer = c.idCustomer
      WHERE p.idExpert = ?
    `, [idExpert, idExpert]);
    
    res.json({ totals, activities });

  } catch (error) {
    console.error("Error fetching expert dashboard data:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { 
  getExperts, 
  createExpertUser, 
  getMyDashboardData 
};