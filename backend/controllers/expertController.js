  const Expert = require("../models/expert");
  const bcrypt = require("bcrypt");
  const { generateUserId } = require("../utils/idGenerator");
  const pool = require("../config/database");
  const fs = require('fs');
  const path = require('path');

  // Lokasi folder upload (harus sama dengan yang di Multer)
  const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'certificate_expert');


  // Fungsi helper untuk menghapus file yang diunggah jika terjadi rollback
  const cleanupFiles = (files) => {
      if (files && files.length > 0) {
          files.forEach(file => {
              try {
                  // Gunakan file.path karena Multer menyimpannya di path ini
                  // Meskipun sudah direname (di dalam try block), path yang perlu dihapus adalah path final
                  fs.unlinkSync(file.path);
              } catch (err) {
                  // File mungkin sudah dihapus atau rename gagal. Abaikan.
                  console.error(`Failed to delete uploaded file: ${file.path}`, err);
              }
          });
      }
  };

  /**
   * @desc    Mengambil semua data expert (termasuk skills)
   * @route   GET /api/expert
   * @access  Private (Admin, PM)
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
      // Fungsi ini sekarang mengembalikan detail skill lengkap
      const expert = await Expert.findByIdWithSkills(idExpert);
      if (!expert) {
        return res.status(404).json({ error: "Expert not found." });
      }
      res.json(expert); // Kirim detail expert termasuk array skills lengkap
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
   * @desc    Membuat user expert baru (termasuk set skills dan file upload)
   * @route   POST /api/expert
   * @access  Private (Admin)
   */
  const createExpertUser = async (req, res) => {
      let connection;
      // Simpan semua file yang berhasil diupload Multer untuk dibersihkan jika ada error
      // req.files adalah objek, kita ubah menjadi array datar
      let uploadedFiles = req.files ? Object.values(req.files).flat() : [];

      try {
          // Ambil data dari req.body (yang diisi oleh Multer dari FormData)
          const {
              nmExpert,
              emailExpert,
              password,
              mobileExpert,
              statExpert,
              Row,
              role,
              expertSkills: expertSkillsString, // Ini adalah string JSON
          } = req.body;

          // Validasi dasar yang sudah lolos Multer
          if (!nmExpert || !emailExpert || !password) {
              cleanupFiles(uploadedFiles);
              return res.status(400).json({ error: "Name, email, and password are required." });
          }

          // 1. Parsing expertSkills dari JSON string menjadi array objek
          let expertSkills = [];
          if (expertSkillsString) {
              try {
                  expertSkills = JSON.parse(expertSkillsString);
                  if (!Array.isArray(expertSkills)) {
                      cleanupFiles(uploadedFiles);
                      return res.status(400).json({ error: "expertSkills format invalid." });
                  }
              } catch (e) {
                  cleanupFiles(uploadedFiles);
                  return res.status(400).json({ error: "expertSkills data corrupted." });
              }
          }
          
          // --- Mulai Transaksi ---
          connection = await pool.getConnection(); 
          await connection.beginTransaction();

          const existingUser = await Expert.findByEmail(emailExpert);
          if (existingUser) {
              await connection.rollback();
              cleanupFiles(uploadedFiles);
              return res.status(400).json({ error: "Email already in use." });
          }

          // Tentukan Role Code untuk ID Generation
          let idRoleCode = "Expert"; 
          if (role === "Head of Expert") idRoleCode = "Head of Expert";
          else if (role === "Trainer") idRoleCode = "Trainer";

          const newExpertId = await generateUserId(idRoleCode); 
          const hashedPassword = await bcrypt.hash(password, 10);
          
          // Array untuk menampung data skills yang sudah disiapkan untuk model
          const expertSkillsToSave = [];

          // 2. Iterasi dan Proses Skills (termasuk file rename)
          for (const skill of expertSkills) {
              let certificatePath = null;
              
              // Cek apakah skill ini memiliki file yang diunggah
              if (skill.certificateFileKey) {
                  // Cari file berdasarkan fieldname yang match dengan certificateFileKey
                  let foundFile = null;
                  
                  if (req.files) {
                      // Jika req.files adalah array (dari .any()), cari file dengan fieldname match
                      if (Array.isArray(req.files)) {
                          foundFile = req.files.find(f => f.fieldname === skill.certificateFileKey);
                      } 
                      // Jika req.files adalah object, cek kedua cara: key match atau fieldname match
                      else {
                          // Cara 1: Cek jika ada key yang match
                          if (req.files[skill.certificateFileKey]) {
                              const fileArray = req.files[skill.certificateFileKey];
                              foundFile = Array.isArray(fileArray) ? fileArray[0] : fileArray;
                          }
                          // Cara 2: Cari di semua files berdasarkan fieldname
                          if (!foundFile) {
                              for (const [key, fileOrArray] of Object.entries(req.files)) {
                                  const fileArray = Array.isArray(fileOrArray) ? fileOrArray : [fileOrArray];
                                  const file = fileArray.find(f => f.fieldname === skill.certificateFileKey);
                                  if (file) {
                                      foundFile = file;
                                      break;
                                  }
                              }
                          }
                      }
                  }

                  if (foundFile) {
                      // 3. Rename File agar menggunakan ID Expert yang baru dan ID Skill
                      const oldPath = foundFile.path;
                      const newFileName = `${newExpertId}_${skill.idSkillCtg}_${Date.now()}${path.extname(foundFile.originalname)}`;
                      const newPath = path.join(UPLOAD_DIR, newFileName);
                      
                      fs.renameSync(oldPath, newPath); // Lakukan rename
                      certificatePath = newFileName; // Simpan hanya nama file di database
                      
                      // Update path file di array uploadedFiles agar cleanupFiles menghapus path yang benar jika rollback
                      const indexInUploadedFiles = uploadedFiles.findIndex(f => f.filename === foundFile.filename);
                      if (indexInUploadedFiles !== -1) {
                          uploadedFiles[indexInUploadedFiles].path = newPath;
                      }
                  }
              }

              // Tambahkan data skill yang sudah bersih ke array final
              expertSkillsToSave.push({
                  idSkillCtg: skill.idSkillCtg,
                  experience: skill.experience,
                  certificate_path: certificatePath, 
              });
          }
          
          // 4. Create the expert record
          await Expert.create(
              {
                  idExpert: newExpertId,
                  nmExpert,
                  emailExpert,
                  password: hashedPassword,
                  mobileExpert,
                  statExpert,
                  Row,
                  role: role || "Expert", 
              },
              connection
          ); 

          // 5. Set skills lengkap (dengan experience dan certificate_path)
          if (expertSkillsToSave.length > 0) {
              await Expert.setExpertSkills(newExpertId, expertSkillsToSave, connection); 
          }

          await connection.commit(); // Commit transaction

          res.status(201).json({
              message: "Expert user created successfully",
              idExpert: newExpertId,
          });
      } catch (error) {
          if (connection) await connection.rollback(); // Rollback database
          cleanupFiles(uploadedFiles); // Hapus file yang sudah diupload/direname
          
          console.error("Error creating expert user:", error.message);
          res.status(500).json({
              error: "Server error while creating expert user.",
              details: error.sqlMessage || error.message,
          });
      } finally {
          if (connection) connection.release();
      }
  };

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

      // Handle dynamic expertSkills with certificate uploads (if provided as FormData)
      // Parse expertSkills from request (can be FormData or JSON)
      let expertSkillsData = [];
      
      if (req.body.expertSkills) {
        try {
          expertSkillsData = typeof req.body.expertSkills === 'string' 
            ? JSON.parse(req.body.expertSkills) 
            : req.body.expertSkills;
        } catch (e) {
          expertSkillsData = [];
        }
      }

      // If expertSkills provided, use new dynamic format; otherwise use legacy skillCtgIds
      if (expertSkillsData && expertSkillsData.length > 0) {
        const expertSkillsToSave = [];

        for (const skill of expertSkillsData) {
          let certificatePath = skill.existingCertificatePath || null;

          // If new certificate file is being uploaded
          if (skill.certificateFileKey) {
            let foundFile = null;

            // Find file by fieldname match
            for (const key in req.files) {
              const file = req.files[key];
              if (file && file.fieldname === skill.certificateFileKey) {
                foundFile = file;
                break;
              }
            }

            if (foundFile) {
              const fileExt = foundFile.originalname.split('.').pop();
              const newFileName = `${idExpert}_${skill.idSkillCtg}_${Date.now()}.${fileExt}`;
              const newFilePath = path.join(
                __dirname,
                "../uploads/certificate_expert",
                newFileName
              );

              // Move file to final location
              fs.renameSync(foundFile.path, newFilePath);
              certificatePath = newFileName;
            }
          }

          expertSkillsToSave.push({
            idSkillCtg: skill.idSkillCtg,
            experience: skill.experience || "",
            certificate_path: certificatePath,
          });
        }

        await Expert.setExpertSkills(idExpert, expertSkillsToSave, connection);
      } else if (skillCtgIds && skillCtgIds.length > 0) {
        // Fallback to legacy format if provided
        await Expert.setExpertSkills(idExpert, skillCtgIds, connection);
      } else {
        // Clear skills if neither provided
        await Expert.setExpertSkills(idExpert, [], connection);
      }    // Password update should be a separate endpoint/logic if needed for security

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

  // ... (Dashboard controllers tidak berubah) ...

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
    updateExpertUser, 
    getMyDashboardData,
    getHeadExpertDashboardData,
  };
