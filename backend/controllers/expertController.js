// backend/controllers/expertController.js
const Expert = require("../models/expert");
const bcrypt = require("bcrypt");
const { generateUserId } = require("../utils/idGenerator");
const pool = require("../config/database"); // Keep for dashboard queries if needed

/**
 * @desc    Mengambil semua data expert (termasuk skills)
 * @route   GET /api/expert
 * @access  Private (Admin, PM)
 */
const getExperts = async (_req, res) => {
  try {
    const experts = await Expert.findAll(); // Now includes comma-separated skills

    // Separate based on role
    const headExperts = experts.filter((e) => e.role === "Head of Expert");
    const regularExperts = experts.filter((e) => e.role !== "Head of Expert"); // Includes 'Expert' and 'Trainer'

    res.json({ headExperts, regularExperts });
  } catch (err) {
    console.error("getExperts error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getExpertById = async (req, res) => {
  const { idExpert } = req.params;
  try {
    // Gunakan fungsi model yang sudah dibuat sebelumnya
    const expert = await Expert.findByIdWithSkills(idExpert);
    if (!expert) {
      return res.status(404).json({ error: "Expert not found." });
    }
    res.json(expert); // Kirim detail expert termasuk array skills
  } catch (error) {
    console.error(`Error fetching expert by ID (${idExpert}):`, error);
    res
      .status(500)
      .json({
        error: "Server error while fetching expert details.",
        details: error.sqlMessage || error.message,
      });
  }
};

/**
 * @desc    Membuat user expert baru (termasuk set skills)
 * @route   POST /api/expert
 * @access  Private (Admin)
 */
const createExpertUser = async (req, res) => {
  // Destructure including skillCtgIds
  const {
    nmExpert,
    emailExpert,
    password,
    mobileExpert,
    statExpert,
    Row,
    role,
    skillCtgIds,
  } = req.body;

  if (!nmExpert || !emailExpert || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }

  // Basic validation for skillCtgIds
  if (skillCtgIds && !Array.isArray(skillCtgIds)) {
    return res.status(400).json({ error: "skillCtgIds must be an array." });
  }

  const connection = await pool.getConnection(); // Use transaction

  try {
    await connection.beginTransaction();

    const existingUser = await Expert.findByEmail(emailExpert);
    if (existingUser) {
      await connection.rollback();
      return res.status(400).json({ error: "Email already in use." });
    }

    // Determine Role Code for ID Generation
    let idRoleCode = "Expert"; // Default
    if (role === "Head of Expert") idRoleCode = "Head of Expert";
    else if (role === "Trainer") idRoleCode = "Trainer";

    const newExpertId = await generateUserId(idRoleCode); // Use appropriate code for ID
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the expert record
    const createResult = await Expert.create(
      {
        idExpert: newExpertId,
        nmExpert,
        emailExpert,
        password: hashedPassword,
        mobileExpert,
        statExpert,
        Row,
        role: role || "Expert", // Ensure role is saved
      },
      connection
    ); // Pass connection for transaction

    // Set skills if provided
    if (skillCtgIds && skillCtgIds.length > 0) {
      await Expert.setExpertSkills(newExpertId, skillCtgIds, connection); // Pass connection
    }

    await connection.commit(); // Commit transaction

    res.status(201).json({
      message: "Expert user created successfully",
      idExpert: newExpertId,
    });
  } catch (error) {
    await connection.rollback(); // Rollback on error
    console.error("Error creating expert user:", error.message);
    res.status(500).json({
      error: "Server error while creating expert user.",
      details: error.sqlMessage || error.message,
    });
  } finally {
    connection.release();
  }
};

// NEW: Controller to update Expert details and skills
const updateExpertUser = async (req, res) => {
  const { idExpert } = req.params;
  // Exclude password, handle skills separately
  const {
    nmExpert,
    emailExpert,
    mobileExpert,
    statExpert,
    Row,
    role,
    skillCtgIds,
  } = req.body;

  // Basic validation
  if (!nmExpert || !emailExpert) {
    return res.status(400).json({ error: "Name and email are required." });
  }
  if (skillCtgIds && !Array.isArray(skillCtgIds)) {
    return res.status(400).json({ error: "skillCtgIds must be an array." });
  }
  if (role && !["Expert", "Head of Expert", "Trainer"].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified." });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check if expert exists (optional but good practice)
    const existingExpert = await Expert.findByIdWithSkills(idExpert);
    if (!existingExpert) {
      await connection.rollback();
      return res.status(404).json({ error: "Expert not found." });
    }

    // Check if email is being changed and if the new email is already taken
    if (emailExpert !== existingExpert.emailExpert) {
      const emailTaken = await Expert.findByEmail(emailExpert);
      if (emailTaken) {
        await connection.rollback();
        return res
          .status(400)
          .json({ error: "New email address is already in use." });
      }
    }

    // 1. Update basic expert details
    await Expert.update(
      idExpert,
      {
        nmExpert,
        emailExpert,
        mobileExpert,
        statExpert,
        Row,
        role,
      },
      connection
    );

    // 2. Update skills using setExpertSkills (handles deletion and insertion)
    await Expert.setExpertSkills(idExpert, skillCtgIds || [], connection);

    // Password update should be a separate endpoint/logic if needed for security

    await connection.commit();
    res.json({ message: "Expert user updated successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating expert user:", error);
    res.status(500).json({
      error: "Server error while updating expert user.",
      details: error.sqlMessage || error.message,
    });
  } finally {
    connection.release();
  }
};

// getMyDashboardData and getHeadExpertDashboardData remain largely unchanged for now,
// unless you need to display skills there.
// If you need skills in dashboards, you'd adjust the queries there similarly to findAll.

const getMyDashboardData = async (req, res) => {
  const idExpert = req.user.id;
  const role = req.user.role;

  let connection;
  try {
    connection = await pool.getConnection();

    let trainingCount, projectCount, activities;
    // Note: outsource count query might need adjustment if you relate it to experts
    const [outsourceCount] = await connection.query(
      "SELECT COUNT(*) as count FROM outsource"
    );

    // Fetch counts and activities based on role (logic remains similar)
    if (role === "Head of Expert" || role === "head of expert") {
      [trainingCount] = await connection.query(
        "SELECT COUNT(*) as count FROM training"
      );
      [projectCount] = await connection.query(
        "SELECT COUNT(*) as count FROM project"
      );
      // Query for activities - Needs JOIN to get expert info if not already present
      // Example adjustment needed if project table doesn't have idExpert directly
      [activities] = await connection.query(`
        SELECT
          'Training' as type, t.idTraining as id, t.nmTraining as name, t.statusTraining as status,
          t.startTraining as startDate, t.endTraining as endDate, c.corpCustomer as customerName,
          tt.nmTypeTraining as activitySubType
        FROM training t
        LEFT JOIN opti o ON t.idOpti = o.idOpti
        LEFT JOIN customer c ON t.idCustomer = c.idCustomer
        LEFT JOIN typetraining tt ON t.idTypeTraining = tt.idTypeTraining
        -- WHERE clauses if needed for Head role

        UNION ALL

        SELECT
          'Project' as type, p.idProject as id, p.nmProject as name, p.statusProject as status,
          p.startProject as startDate, p.endProject as endDate, c.corpCustomer as customerName,
          tp.nmTypeProject as activitySubType
        FROM project p
        JOIN project_expert pe ON p.idProject = pe.idProject -- Join through junction table
        LEFT JOIN opti o ON p.idOpti = o.idOpti
        LEFT JOIN customer c ON p.idCustomer = c.idCustomer
        LEFT JOIN typeproject tp ON p.idTypeProject = tp.idTypeProject
        -- WHERE clauses if needed
      `);
    } else {
      // Regular Expert or Trainer
      [trainingCount] = await connection.query(
        "SELECT COUNT(*) as count FROM training WHERE idExpert = ?",
        [idExpert]
      );
      // Count projects associated via the junction table
      [projectCount] = await connection.query(
        "SELECT COUNT(*) as count FROM project_expert WHERE idExpert = ?",
        [idExpert]
      );

      // Fetch activities specific to the expert
      [activities] = await connection.query(
        `
        SELECT
          'Training' as type, t.idTraining as id, t.nmTraining as name, t.statusTraining as status,
          t.startTraining as startDate, t.endTraining as endDate, c.corpCustomer as customerName,
          tt.nmTypeTraining as activitySubType
        FROM training t
        LEFT JOIN opti o ON t.idOpti = o.idOpti
        LEFT JOIN customer c ON t.idCustomer = c.idCustomer
        LEFT JOIN typetraining tt ON t.idTypeTraining = tt.idTypeTraining
        WHERE t.idExpert = ?

        UNION ALL

        SELECT
          'Project' as type, p.idProject as id, p.nmProject as name, p.statusProject as status,
          p.startProject as startDate, p.endProject as endDate, c.corpCustomer as customerName,
          tp.nmTypeProject as activitySubType
        FROM project p
        JOIN project_expert pe ON p.idProject = pe.idProject -- Join through junction table
        LEFT JOIN opti o ON p.idOpti = o.idOpti
        LEFT JOIN customer c ON p.idCustomer = c.idCustomer
        LEFT JOIN typeproject tp ON p.idTypeProject = tp.idTypeProject
        WHERE pe.idExpert = ?
      `,
        [idExpert, idExpert]
      );
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

const getHeadExpertDashboardData = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Total Activities by Status (Query might need adjustment based on project/training relations)
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

    // 4. Skill Distribution of Experts (Using new structure)
    const [skillDistribution] = await connection.query(`
      SELECT sc.nmSkillCtg as skill, COUNT(DISTINCT s.idExpert) as count
      FROM skill s
      JOIN skill_category sc ON s.idSkillCtg = sc.idSkillCtg
      GROUP BY sc.nmSkillCtg
    `);

    // 5. Activities per Expert (Adjust for project junction)
    const [activitiesPerExpert] = await connection.query(`
       SELECT e.nmExpert as expertName, COUNT(all_activities.id) as count
       FROM expert e
       LEFT JOIN (
           SELECT idExpert, idTraining as id FROM training
           UNION ALL
           SELECT idExpert, idProject as id FROM project_expert -- Use junction table
       ) as all_activities ON e.idExpert = all_activities.idExpert
       GROUP BY e.idExpert, e.nmExpert
       ORDER BY count DESC
    `);

    // 6. Monthly Activity Trend (Query structure seems okay)
    const [monthlyActivityTrend] = await connection.query(`
      SELECT
          DATE_FORMAT(activityDate, '%Y-%m') as month,
          COUNT(*) as count
      FROM (
          SELECT startTraining as activityDate FROM training WHERE startTraining IS NOT NULL
          UNION ALL
          SELECT startProject as activityDate FROM project WHERE startProject IS NOT NULL
      ) as all_activities
      GROUP BY month
      ORDER BY month ASC
    `);

    // 7. Top Performing Experts (Adjust for project junction)
    const [topExperts] = await connection.query(`
       SELECT e.nmExpert as expertName, COUNT(all_finished_activities.id) as finishedCount
       FROM expert e
       LEFT JOIN (
           SELECT idExpert, idTraining as id FROM training WHERE statusTraining = 'Training Delivered'
           UNION ALL
           SELECT pe.idExpert, pe.idProject as id FROM project_expert pe JOIN project p ON pe.idProject = p.idProject WHERE p.statusProject = 'Finished'
       ) as all_finished_activities ON e.idExpert = all_finished_activities.idExpert
       GROUP BY e.idExpert, e.nmExpert
       ORDER BY finishedCount DESC
       LIMIT 5
    `);

    // 8. Customers Served by Expert (Adjust for project junction)
    const [customersServedByExpert] = await connection.query(`
      SELECT e.nmExpert as expertName, COUNT(DISTINCT c.idCustomer) as uniqueCustomersCount
      FROM expert e
      LEFT JOIN (
          SELECT idExpert, idCustomer FROM training WHERE idCustomer IS NOT NULL
          UNION ALL
          SELECT pe.idExpert, p.idCustomer FROM project_expert pe JOIN project p ON pe.idProject = p.idProject WHERE p.idCustomer IS NOT NULL
      ) as expert_customer_activities ON e.idExpert = expert_customer_activities.idExpert
      LEFT JOIN customer c ON expert_customer_activities.idCustomer = c.idCustomer
      WHERE c.idCustomer IS NOT NULL
      GROUP BY e.idExpert, e.nmExpert
      ORDER BY uniqueCustomersCount DESC
    `);

    // 9. Raw Activities List (Query structure seems okay)
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
      activities,
    });
  } catch (error) {
    console.error("Error fetching head expert dashboard data:", error);
    res.status(500).json({
      error:
        "Terjadi kesalahan pada server saat mengambil data dasbor Head of Expert.",
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  getExperts,
  getExpertById,
  createExpertUser,
  updateExpertUser, // Export new update function
  getMyDashboardData,
  getHeadExpertDashboardData,
};
