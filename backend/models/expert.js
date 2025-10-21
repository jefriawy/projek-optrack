// backend/models/expert.js
const pool = require("../config/database");

const Expert = {
  // Modified findAll to include multiple skills (comma-separated names)
  async findAll() {
    const [rows] = await pool.query(
      `SELECT
         e.idExpert, e.nmExpert, e.mobileExpert, e.emailExpert, e.statExpert, e.role,
         COUNT(DISTINCT o.idOpti) AS totalProjects,
         GROUP_CONCAT(DISTINCT sc.nmSkillCtg ORDER BY sc.nmSkillCtg SEPARATOR ', ') AS skills
       FROM expert e
       LEFT JOIN opti o ON e.idExpert = o.idExpert
       LEFT JOIN skill s ON e.idExpert = s.idExpert              -- Join junction table
       LEFT JOIN skill_category sc ON s.idSkillCtg = sc.idSkillCtg -- Join category table
       GROUP BY e.idExpert
       ORDER BY e.nmExpert ASC`
    );
    return rows;
  },

  async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM expert WHERE emailExpert = ?",
      [email]
    );
    return rows[0];
  },

  // NEW: Function to find an expert by ID including their skills as an array of objects
  async findByIdWithSkills(idExpert) {
    const [expertRows] = await pool.query(
      "SELECT * FROM expert WHERE idExpert = ?",
      [idExpert]
    );
    if (expertRows.length === 0) {
      return null;
    }
    const expert = expertRows[0];

    const [skillRows] = await pool.query(
      `SELECT sc.idSkillCtg, sc.nmSkillCtg
           FROM skill s
           JOIN skill_category sc ON s.idSkillCtg = sc.idSkillCtg
           WHERE s.idExpert = ?
           ORDER BY sc.nmSkillCtg`,
      [idExpert]
    );
    expert.skills = skillRows; // Add skills as an array of { idSkillCtg, nmSkillCtg }
    return expert;
  },

  // Modified create: Removed idSkill, doesn't handle skill insertion here directly
  async create(expertData) {
    const {
      idExpert,
      nmExpert,
      emailExpert,
      password,
      mobileExpert,
      statExpert,
      Row,
      role,
    } = expertData;
    const [result] = await pool.query(
      `INSERT INTO expert (idExpert, nmExpert, emailExpert, password, mobileExpert, statExpert, Row, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idExpert,
        nmExpert,
        emailExpert,
        password,
        mobileExpert || null,
        statExpert || null,
        Row || null,
        role || "Expert",
      ]
    );
    // Return the ID of the created expert
    return { insertId: idExpert }; // Match previous structure slightly better
  },

  // NEW: Function to set/replace skills for an expert within a transaction
  async setExpertSkills(idExpert, skillCtgIds, connection = pool) {
    // Ensure connection is used if provided (for transactions)
    const conn = connection === pool ? await pool.getConnection() : connection;
    try {
      if (connection === pool) await conn.beginTransaction(); // Start transaction only if not already in one

      // Delete existing skills for this expert
      await conn.query("DELETE FROM skill WHERE idExpert = ?", [idExpert]);

      // Insert new skills if any are provided
      if (Array.isArray(skillCtgIds) && skillCtgIds.length > 0) {
        const values = skillCtgIds.map((idSkillCtg) => [idExpert, idSkillCtg]);
        await conn.query("INSERT INTO skill (idExpert, idSkillCtg) VALUES ?", [
          values,
        ]);
      }

      if (connection === pool) await conn.commit(); // Commit only if this function started the transaction
    } catch (error) {
      if (connection === pool) await conn.rollback(); // Rollback only if this function started the transaction
      console.error("Error setting expert skills:", error);
      throw error; // Re-throw the error to be handled by the controller
    } finally {
      if (connection === pool) conn.release(); // Release connection only if obtained here
    }
  },

  // NEW: Update function (example, adjust fields as needed)
  async update(idExpert, expertData) {
    // Only update fields that are allowed to be changed, exclude password and skills here
    const { nmExpert, emailExpert, mobileExpert, statExpert, Row, role } =
      expertData;
    const [result] = await pool.query(
      `UPDATE expert SET
            nmExpert = ?, emailExpert = ?, mobileExpert = ?, statExpert = ?, Row = ?, role = ?
         WHERE idExpert = ?`,
      [nmExpert, emailExpert, mobileExpert, statExpert, Row, role, idExpert]
    );
    return result.affectedRows;
  },

  // NEW: Function to update password separately for security
  async updatePassword(idExpert, hashedPassword) {
    const [result] = await pool.query(
      "UPDATE expert SET password = ? WHERE idExpert = ?",
      [hashedPassword, idExpert]
    );
    return result.affectedRows;
  },
};

module.exports = Expert;
