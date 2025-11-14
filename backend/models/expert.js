const pool = require("../config/database");

const Expert = {
  // Modified findAll to include multiple skills (comma-separated names)
  async findAll() {
    const [rows] = await pool.query(
      'SELECT e.idExpert, e.nmExpert, e.mobileExpert, e.emailExpert, e.statExpert, e.role, ' +
      "COUNT(DISTINCT o.idOpti) AS totalProjects, " +
      "GROUP_CONCAT(DISTINCT sc.nmSkillCtg ORDER BY sc.nmSkillCtg SEPARATOR ', ') AS skills " +
      'FROM expert e ' +
      'LEFT JOIN opti o ON e.idExpert = o.idExpert ' +
      'LEFT JOIN skill s ON e.idExpert = s.idExpert ' +
      'LEFT JOIN skill_category sc ON s.idSkillCtg = sc.idSkillCtg ' +
      'GROUP BY e.idExpert ' +
      'ORDER BY e.nmExpert ASC'
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

  // MODIFIKASI: findByIdWithSkills sekarang mengembalikan detail skill lengkap
  async findByIdWithSkills(idExpert) {
    const [expertRows] = await pool.query(
      "SELECT * FROM expert WHERE idExpert = ?",
      [idExpert]
    );
    if (expertRows.length === 0) {
      return null;
    }
    const expert = expertRows[0];

    try {
      const [skillRows] = await pool.query(
        `SELECT
           sc.idSkillCtg,
           sc.nmSkillCtg,
           s.experience,
           s.certificate_path
         FROM skill s
         JOIN skill_category sc ON s.idSkillCtg = sc.idSkillCtg
         WHERE s.idExpert = ?
         ORDER BY sc.nmSkillCtg`,
        [idExpert]
      );
      expert.skills = skillRows || [];
    } catch (err) {
      console.warn(`Warning fetching skills for expert ${idExpert}:`, err.message);
      expert.skills = [];
    }
    return expert;
  },  // MODIFIKASI: create sekarang menerima connection untuk transaksi
  async create(expertData, connection = pool) {
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
    const [result] = await connection.query(
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
    return { insertId: idExpert };
  },  // MODIFIKASI: setExpertSkills sekarang menerima array objek skill yang lengkap
  async setExpertSkills(idExpert, expertSkillsArray, connection = pool) {
    // expertSkillsArray: [{ idSkillCtg, experience, certificatePath }]
    const conn = connection === pool ? await pool.getConnection() : connection;
    try {
      if (connection === pool) await conn.beginTransaction(); 

      // 1. Hapus semua skill yang ada untuk Expert ini
      await conn.query("DELETE FROM skill WHERE idExpert = ?", [idExpert]);

      // 2. Masukkan skill baru dengan experience dan certificate_path
      if (Array.isArray(expertSkillsArray) && expertSkillsArray.length > 0) {
                // Buat placeholder VALUES (?, ?, ?, ?) untuk setiap skill
        const placeholders = expertSkillsArray.map(() => "(?, ?, ?, ?)").join(", ");
        const flatValues = expertSkillsArray.flatMap(skill => [
          idExpert, 
          skill.idSkillCtg,
          skill.experience || "",
          skill.certificate_path || null
        ]);
        
        const insertQuery = `INSERT INTO skill (idExpert, idSkillCtg, experience, certificate_path) VALUES ${placeholders}`;

        await conn.query(insertQuery, flatValues);
      }

      if (connection === pool) await conn.commit(); 
    } catch (error) {
      if (connection === pool) await conn.rollback(); 
      console.error("Error setting expert skills:", error);
      throw error;
    } finally {
      if (connection === pool) conn.release(); 
    }
  },

  // update tidak berubah (hanya mengupdate detail expert utama)
  async update(idExpert, expertData, connection = pool) {
    const { nmExpert, emailExpert, mobileExpert, statExpert, Row, role } =
      expertData;
    const [result] = await connection.query(
      `UPDATE expert SET
            nmExpert = ?, emailExpert = ?, mobileExpert = ?, statExpert = ?, Row = ?, role = ?
         WHERE idExpert = ?`,
      [nmExpert, emailExpert, mobileExpert, statExpert, Row, role, idExpert]
    );
    return result.affectedRows;
  },

  // updatePassword tidak berubah
  async updatePassword(idExpert, hashedPassword, connection = pool) {
    const [result] = await connection.query(
      "UPDATE expert SET password = ? WHERE idExpert = ?",
      [hashedPassword, idExpert]
    );
    return result.affectedRows;
  },
};

module.exports = Expert;
