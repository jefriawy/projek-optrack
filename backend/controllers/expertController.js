const Expert = require("../models/expert");
const bcrypt = require("bcrypt");
const { generateUserId } = require("../utils/idGenerator");
const pool = require('../config/database');

/**
 * @desc    Mengambil semua data expert
 * @route   GET /api/expert
 * @access  Private (Admin)
 */
const getExperts = async (_req, res) => {
  try {
    const experts = await Expert.findAll();
    
    const headExperts = experts.filter(e => e.role === 'Head of Expert');
    const regularExperts = experts.filter(e => e.role !== 'Head of Expert');

    res.json({ headExperts, regularExperts });
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
  const { nmExpert, emailExpert, password, mobileExpert, idSkill, statExpert, Row, role } = req.body;

  if (!nmExpert || !emailExpert || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    const existingUser = await Expert.findByEmail(emailExpert);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }
  const newExpertId = await generateUserId(role === 'Head of Expert' ? 'Head of Expert' : 'Expert');
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
      role: role || 'Expert',
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
  const role = req.user.role;

  let connection;
  try {
    connection = await pool.getConnection();

    let trainingCount, projectCount, activities;
    const [outsourceCount] = await connection.query('SELECT COUNT(*) as count FROM outsource');

    if (role === 'Head of Expert' || role === 'head of expert') {
      // Head of Expert: lihat semua
      [trainingCount] = await connection.query('SELECT COUNT(*) as count FROM training');
      [projectCount] = await connection.query('SELECT COUNT(*) as count FROM project');
      [activities] = await connection.query(`
        SELECT 
          'Training' as type, 
          t.idTraining as id,
          t.nmTraining as name, 
          t.statusTraining as status,
          t.startTraining as startDate,
          t.endTraining as endDate, 
          c.nmCustomer as customerName,
          tt.nmTypeTraining as activitySubType
        FROM training t
        LEFT JOIN opti o ON t.idOpti = o.idOpti
        LEFT JOIN customer c ON t.idCustomer = c.idCustomer
        LEFT JOIN typetraining tt ON t.idTypeTraining = tt.idTypeTraining
        WHERE o.statOpti IN ('On-Progress', 'Success', 'Follow Up')
        
        UNION ALL
        
        SELECT 
          'Project' as type, 
          p.idProject as id,
          p.nmProject as name, 
          p.statusProject as status,
          p.startProject as startDate,
          p.endProject as endDate, 
          c.nmCustomer as customerName,
          tp.nmTypeProject as activitySubType
        FROM project p
        LEFT JOIN opti o ON p.idOpti = o.idOpti
        LEFT JOIN customer c ON p.idCustomer = c.idCustomer
        LEFT JOIN typeproject tp ON p.idTypeProject = tp.idTypeProject
        WHERE o.statOpti IN ('On-Progress', 'Success', 'Follow Up')
      `);
    } else {
      // Expert biasa: hanya miliknya sendiri
      [trainingCount] = await connection.query('SELECT COUNT(*) as count FROM training WHERE idExpert = ?', [idExpert]);
      [projectCount] = await connection.query('SELECT COUNT(*) as count FROM project WHERE idExpert = ?', [idExpert]);
      [activities] = await connection.query(`
        SELECT 
          'Training' as type, 
          t.idTraining as id,
          t.nmTraining as name, 
          t.statusTraining as status,
          t.startTraining as startDate,
          t.endTraining as endDate, 
          c.nmCustomer as customerName,
          tt.nmTypeTraining as activitySubType
        FROM training t
        LEFT JOIN opti o ON t.idOpti = o.idOpti
        LEFT JOIN customer c ON t.idCustomer = c.idCustomer
        LEFT JOIN typetraining tt ON t.idTypeTraining = tt.idTypeTraining
        WHERE t.idExpert = ? AND o.statOpti IN ('On-Progress', 'Success', 'Follow Up')
        
        UNION ALL
        
        SELECT 
          'Project' as type, 
          p.idProject as id,
          p.nmProject as name, 
          p.statusProject as status,
          p.startProject as startDate,
          p.endProject as endDate, 
          c.nmCustomer as customerName,
          tp.nmTypeProject as activitySubType
        FROM project p
        LEFT JOIN opti o ON p.idOpti = o.idOpti
        LEFT JOIN customer c ON p.idCustomer = c.idCustomer
        LEFT JOIN typeproject tp ON p.idTypeProject = tp.idTypeProject
        WHERE p.idExpert = ? AND o.statOpti IN ('On-Progress', 'Success', 'Follow Up')
      `, [idExpert, idExpert]);
    }

    const totals = {
      training: trainingCount[0].count,
      project: projectCount[0].count,
      outsource: outsourceCount[0].count,
    };

    res.json({ totals, activities });

  } catch (error) {
    console.error("Error fetching expert dashboard data:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  } finally {
    if (connection) connection.release();
  }
};

/**
 * @desc    Mengambil data dashboard agregat untuk Head of Expert
 * @route   GET /api/expert/head-dashboard
 * @access  Private (Admin, Head of Expert)
 */
const getHeadExpertDashboardData = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Total Activities by Status
    const [totalActivitiesByStatus] = await connection.query(`
      SELECT status, COUNT(*) as count
      FROM (
          SELECT statusTraining as status FROM training
          UNION ALL
          SELECT statusProject as status FROM project
      ) as all_activities
      GROUP BY status
    `);

    // 2. Training Type Distribution
    const [trainingTypeDistribution] = await connection.query(`
      SELECT tt.nmTypeTraining as type, COUNT(t.idTraining) as count
      FROM training t
      JOIN typetraining tt ON t.idTypeTraining = tt.idTypeTraining
      GROUP BY tt.nmTypeTraining
    `);

    // 3. Project Type Distribution
    const [projectTypeDistribution] = await connection.query(`
      SELECT tp.nmTypeProject as type, COUNT(p.idProject) as count
      FROM project p
      JOIN typeproject tp ON p.idTypeProject = tp.idTypeProject
      GROUP BY tp.nmTypeProject
    `);

    // 4. Skill Distribution of Experts
    const [skillDistribution] = await connection.query(`
      SELECT s.nmSkill as skill, COUNT(e.idExpert) as count
      FROM expert e
      JOIN skill s ON e.idSkill = s.idSkill
      GROUP BY s.nmSkill
    `);

    // 5. Activities per Expert
    const [activitiesPerExpert] = await connection.query(`
      SELECT e.nmExpert as expertName, COUNT(all_activities.id) as count
      FROM (
          SELECT idExpert, idTraining as id FROM training
          UNION ALL
          SELECT idExpert, idProject as id FROM project
      ) as all_activities
      JOIN expert e ON all_activities.idExpert = e.idExpert
      GROUP BY e.nmExpert
      ORDER BY count DESC
    `);

    // 6. Monthly Activity Trend
    const [monthlyActivityTrend] = await connection.query(`
      SELECT
          DATE_FORMAT(activityDate, '%Y-%m') as month,
          COUNT(*) as count
      FROM (
          SELECT startTraining as activityDate FROM training
          UNION ALL
          SELECT startProject as activityDate FROM project
      ) as all_activities
      WHERE activityDate IS NOT NULL
      GROUP BY month
      ORDER BY month ASC
    `);

    // 7. Top Performing Experts (based on finished activities)
    const [topExperts] = await connection.query(`
      SELECT e.nmExpert as expertName, COUNT(all_finished_activities.id) as finishedCount
      FROM (
          SELECT idExpert, idTraining as id FROM training WHERE statusTraining = 'Finished'
          UNION ALL
          SELECT idExpert, idProject as id FROM project WHERE statusProject = 'Finished'
      ) as all_finished_activities
      JOIN expert e ON all_finished_activities.idExpert = e.idExpert
      GROUP BY e.nmExpert
      ORDER BY finishedCount DESC
      LIMIT 5
    `);

    // 8. Customers Served by Expert (unique customers per expert)
    const [customersServedByExpert] = await connection.query(`
      SELECT e.nmExpert as expertName, COUNT(DISTINCT c.idCustomer) as uniqueCustomersCount
      FROM (
          SELECT idExpert, idCustomer FROM training
          UNION ALL
          SELECT idExpert, idCustomer FROM project
      ) as expert_customer_activities
      JOIN expert e ON expert_customer_activities.idExpert = e.idExpert
      JOIN customer c ON expert_customer_activities.idCustomer = c.idCustomer
      GROUP BY e.nmExpert
      ORDER BY uniqueCustomersCount DESC
    `);

    // 9. Raw Activities List (for breakdown chart)
    const [activities] = await connection.query(`
      SELECT 
        'Training' as type, 
        t.statusTraining as status
      FROM training t
      UNION ALL
      SELECT 
        'Project' as type, 
        p.statusProject as status
      FROM project p
    `);

    res.json({
      totalActivitiesByStatus,
      trainingTypeDistribution,
      projectTypeDistribution,
      skillDistribution,
      activitiesPerExpert,
      monthlyActivityTrend,
      topExperts,
      customersServedByExpert,
      activities, // <-- Tambahkan ini
    });

  } catch (error) {
    console.error("Error fetching head expert dashboard data:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server saat mengambil data dasbor Head of Expert." });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { 
  getExperts, 
  createExpertUser, 
  getMyDashboardData, 
  getHeadExpertDashboardData 
};