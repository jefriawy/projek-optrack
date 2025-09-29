// backend/controllers/optiController.js

const Opti = require("../models/opti");
const Customer = require("../models/customer");
const Expert = require("../models/expert");
const pool = require("../config/database");
const path = require("path");
const fs = require("fs");
const Training = require("../models/trainingModel");
const Project = require("../models/projectModel");
const { generateUserId } = require("../utils/idGenerator");

const toNull = (v) => (v === "" || v === undefined ? null : v);

// Fungsi helper untuk memastikan format tanggal sesuai dengan MySQL
const formatDateForDB = (dateString) => {
  if (!dateString) return null;
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) {
    console.error(`Invalid date format detected: ${dateString}`);
    return null;
  }
  // Mengubah format string datetime menjadi format yang dikenali MySQL
  // tanpa terpengaruh zona waktu server.
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  const h = String(dateObj.getHours()).padStart(2, "0");
  const mi = String(dateObj.getMinutes()).padStart(2, "0");
  const s = String(dateObj.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${mi}:${s}`;
};

const createOpti = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    if (!req.body || Object.keys(req.body).length === 0) {
      await connection.rollback();
      return res.status(400).json({
        error: "Body kosong. Kirim sebagai multipart/form-data atau JSON.",
      });
    }

    const b = { ...req.body };
    const { user } = req;

    let idSalesForOpti;
    if (user.role === "Sales") {
      idSalesForOpti = user.id;
    } else {
      const customer = await Customer.findById(Number(b.idCustomer));
      if (!customer || !customer.idSales) {
        await connection.rollback();
        return res
          .status(400)
          .json({ error: "Customer atau Sales terkait tidak ditemukan." });
      }
      idSalesForOpti = customer.idSales;
    }

    const idOpti = await generateUserId("Opti");
    const optiData = {
      idOpti,
      nmOpti: b.nmOpti,
      idCustomer: Number(b.idCustomer),
      contactOpti: toNull(b.contactOpti),
      emailOpti: toNull(b.emailOpti),
      mobileOpti: toNull(b.mobileOpti),
      statOpti: "opti entry",
      datePropOpti: b.datePropOpti,
      idSumber: Number(b.idSumber),
      kebutuhan: toNull(b.kebutuhan),
      jenisOpti: b.jenisOpti,
      idExpert: toNull(b.idExpert) ? Number(b.idExpert) : null,
      valOpti:
        b.valOpti !== undefined && b.valOpti !== "" ? Number(b.valOpti) : null,

      startProgram: formatDateForDB(b.startTraining),
      endProgram: formatDateForDB(b.endTraining),
      placeProgram: toNull(b.placeTraining),
      idTypeTraining:
        b.jenisOpti === "Training"
          ? toNull(b.idTypeTraining)
            ? Number(b.idTypeTraining)
            : null
          : null,
      idTypeProject:
        b.jenisOpti === "Project"
          ? toNull(b.idTypeTraining)
            ? Number(b.idTypeTraining)
            : null
          : null,

      proposalOpti: null,
    };
    if (req.file) {
  optiData.proposalOpti = path.basename(req.file.filename);
}

    await Opti.create(optiData, idSalesForOpti, connection);
    await connection.commit();
    res.status(201).json({ message: "Opportunity created", data: { idOpti } });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating opportunity:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  } finally {
    connection.release();
  }
};

const updateOpti = async (req, res) => {
  const { id } = req.params;
  const b = { ...req.body };
  const { user } = req;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const existingOpti = await Opti.findById(id, user);
    if (!existingOpti) {
      await connection.rollback();
      return res.status(404).json({ error: "Opportunity not found" });
    }

    if (user.role === "Sales" && existingOpti.idSales !== user.id) {
      await connection.rollback();
      return res.status(403).json({
        error: "Forbidden: You can only update your own opportunities.",
      });
    }

    const optiData = {
      nmOpti: b.nmOpti || existingOpti.nmOpti,
      idCustomer: b.idCustomer ? Number(b.idCustomer) : existingOpti.idCustomer,
      contactOpti: toNull(b.contactOpti) ?? existingOpti.contactOpti,
      emailOpti: toNull(b.emailOpti) ?? existingOpti.emailOpti,
      mobileOpti: toNull(b.mobileOpti) ?? existingOpti.mobileOpti,
      statOpti:
        user.role === "Head Sales" || user.role === "Admin"
          ? b.statOpti || existingOpti.statOpti
          : existingOpti.statOpti,
      datePropOpti: b.datePropOpti || existingOpti.datePropOpti,
      idSumber: b.idSumber ? Number(b.idSumber) : existingOpti.idSumber,
      kebutuhan: toNull(b.kebutuhan) ?? existingOpti.kebutuhan,
      jenisOpti: b.jenisOpti || existingOpti.jenisOpti,
      idExpert: toNull(b.idExpert) ? Number(b.idExpert) : existingOpti.idExpert,
      valOpti:
        b.valOpti !== undefined && b.valOpti !== ""
          ? Number(b.valOpti)
          : existingOpti.valOpti,
      startProgram:
        formatDateForDB(b.startTraining) ?? existingOpti.startProgram,
      endProgram: formatDateForDB(b.endTraining) ?? existingOpti.endProgram,
      placeProgram: toNull(b.placeTraining) ?? existingOpti.placeProgram,
      idTypeTraining:
        b.jenisOpti === "Training"
          ? toNull(b.idTypeTraining)
            ? Number(b.idTypeTraining)
            : existingOpti.idTypeTraining
          : existingOpti.idTypeTraining,
      idTypeProject:
        b.jenisOpti === "Project"
          ? toNull(b.idTypeTraining)
            ? Number(b.idTypeTraining)
            : existingOpti.idTypeProject
          : existingOpti.idTypeProject,
      proposalOpti: existingOpti.proposalOpti,
      dokPendaftaran:
        toNull(b.dokPendaftaran) ?? existingOpti.dokPendaftaran,
    };

    if (req.file) {
      optiData.proposalOpti = path.basename(req.file.filename);
      if (existingOpti.proposalOpti) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "uploads",
          "proposals",
          existingOpti.proposalOpti
        );
        fs.unlink(oldFilePath, () => {});
      }
    }

    await Opti.update(id, optiData, connection);

    const isStatusChangedToPoReceived =
      optiData.statOpti === "po received" &&
      existingOpti.statOpti !== "po received";

    if (isStatusChangedToPoReceived) {
      const createRelatedEntity = async (type) => {
        const idOpti = id;
        const query =
          type === "Training"
            ? "SELECT idTraining FROM training WHERE idOpti = ? LIMIT 1"
            : "SELECT idProject FROM project WHERE idOpti = ? LIMIT 1";
        const [existing] = await connection.query(query, [idOpti]);

        if (existing.length === 0) {
          console.log(`Creating new ${type} for Opti ${idOpti}`);
          const newId = await generateUserId(type);
          const payload = {
            idOpti: idOpti,
            nm: optiData.nmOpti,
            idType:
              type === "Training"
                ? optiData.idTypeTraining
                : optiData.idTypeProject,
            start: optiData.startProgram,
            end: optiData.endProgram,
            idExpert: optiData.idExpert,
            place: optiData.placeProgram,
            idCustomer: optiData.idCustomer,
          };

          if (type === "Training") {
            await Training.createTraining(
              {
                idTraining: newId,
                nmTraining: payload.nm,
                idTypeTraining: payload.idType,
                startTraining: payload.start,
                endTraining: payload.end,
                idExpert: payload.idExpert,
                placeTraining: payload.place,
                idCustomer: payload.idCustomer,
                idOpti: payload.idOpti,
              },
              connection
            );
          } else {
            await Project.createProject(
              {
                idProject: newId,
                nmProject: payload.nm,
                idTypeProject: payload.idType,
                startProject: payload.start,
                endProject: payload.end,
                idExpert: payload.idExpert,
                placeProject: payload.place,
                idCustomer: payload.idCustomer,
                idOpti: payload.idOpti,
              },
              connection
            );
          }
        }
      };

      if (optiData.jenisOpti === "Training") {
        await createRelatedEntity("Training");
      } else if (optiData.jenisOpti === "Project") {
        await createRelatedEntity("Project");
      }
    }

    // Perbaikan: Sinkronisasi data ke tabel training/project saat di-update
    if (
      optiData.jenisOpti === "Training" &&
      (existingOpti.statOpti === "po received" ||
        existingOpti.statOpti === "opti on going")
    ) {
      const [trainingsToUpdate] = await connection.query(
        "SELECT idTraining FROM training WHERE idOpti = ?",
        [id]
      );
      if (trainingsToUpdate.length > 0) {
        const trainingId = trainingsToUpdate[0].idTraining;
        await connection.query(
          `UPDATE training SET 
             nmTraining = ?, startTraining = ?, endTraining = ?, placeTraining = ?, 
             idExpert = ?, idTypeTraining = ? 
           WHERE idTraining = ?`,
          [
            optiData.nmOpti,
            optiData.startProgram,
            optiData.endProgram,
            optiData.placeProgram,
            optiData.idExpert,
            optiData.idTypeTraining,
            trainingId,
          ]
        );
      }
    } else if (
      optiData.jenisOpti === "Project" &&
      (existingOpti.statOpti === "po received" ||
        existingOpti.statOpti === "opti on going")
    ) {
      const [projectsToUpdate] = await connection.query(
        "SELECT idProject FROM project WHERE idOpti = ?",
        [id]
      );
      if (projectsToUpdate.length > 0) {
        const projectId = projectsToUpdate[0].idProject;
        await connection.query(
          `UPDATE project SET 
             nmProject = ?, startProject = ?, endProject = ?, placeProject = ?, 
             idExpert = ?, idTypeProject = ? 
           WHERE idProject = ?`,
          [
            optiData.nmOpti,
            optiData.startProgram,
            optiData.endProgram,
            optiData.placeProgram,
            optiData.idExpert,
            optiData.idTypeProject,
            projectId,
          ]
        );
      }
    }

    await connection.commit();
    res.json({ message: "Opportunity updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating opportunity:", error);
    res
      .status(500)
      .json({ error: "Server error", details: error.message || String(error) });
  } finally {
    connection.release();
  }
};

const getOptis = async (req, res) => {
  try {
    // Destructure search parameters from the query string
    const { corpCustomer, nmOpti, nmSales, program, status, page: pageStr, limit: limitStr } = req.query;
    const page = parseInt(pageStr) || 1;
    const limit = parseInt(limitStr) || 10;
    const offset = (page - 1) * limit;
    const { user } = req;

    const searchCriteria = { corpCustomer, nmOpti, nmSales };

    const [optis, totalCount] = await Opti.findAllPaginated(
      searchCriteria, // Pass criteria to the model
      limit,
      offset,
      user,
      program,
      status
    );
    const transformedOptis = optis.map((opti) => ({
      ...opti,
      proposalPath: opti.proposalOpti
        ? `uploads/proposals/${opti.proposalOpti}`
        : null,
      proposalFileName: opti.proposalOpti || null,
    }));
    res.json({
      data: transformedOptis,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

const getFormOptions = async (req, res) => {
  try {
    const experts = await Expert.findAll();
    const [sumberRows] = await pool.query(
      "SELECT idSumber, nmSumber FROM sumber ORDER BY nmSumber ASC"
    );
    let customers = [];
    if (req.user.role === "Sales") {
      const idSales = req.user.id;
      const [salesRow] = await pool.query(
        "SELECT idSales FROM sales WHERE idSales = ?",
        [idSales]
      );
      customers = salesRow.length ? await Customer.findBySalesId(idSales) : [];
    } else {
      customers = await Customer.findAll();
    }

    res.json({
      customers,
      sumber: sumberRows ?? [],
      experts,
    });
  } catch (error) {
    console.error("Error fetching form options:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getOptiById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const opti = await Opti.findById(id, user);
    if (!opti) {
      return res
        .status(404)
        .json({ error: "Opportunity not found or not accessible" });
    }
    const transformedOpti = {
  ...opti,
  startTraining: opti.startProgram ?? null,
  endTraining: opti.endProgram ?? null,
  placeTraining: opti.placeProgram ?? null,
  idTypeTraining: opti.idTypeTraining ?? opti.idTypeProject ?? null,
  proposalPath: opti.proposalOpti
    ? `uploads/proposals/${opti.proposalOpti}`
    : null,
  proposalFileName: opti.proposalOpti || null, // <-- tambahkan ini
  dokPendaftaranPath: opti.dokPendaftaran
    ? `uploads/dokumen/${opti.dokPendaftaran}`
    : null,
};
    delete transformedOpti.proposalOpti;
    delete transformedOpti.startProgram;
    delete transformedOpti.endProgram;
    delete transformedOpti.placeProgram;
    delete transformedOpti.idTypeProject;
    // remove old field name if existed
    delete transformedOpti.buktiPembayaran;

    res.json(transformedOpti);
  } catch (error) {
    console.error("Error fetching opportunity detail:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const uploadPaymentProof = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if (!req.file) {
    return res
      .status(400)
      .json({ error: "File dokumen pendaftaran tidak ditemukan." });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const existingOpti = await Opti.findById(id, user);
    if (!existingOpti) {
      await connection.rollback();
      return res.status(404).json({ error: "Opportunity not found" });
    }

    if (existingOpti.dokPendaftaran) {
      const oldFilePath = path.join(
        __dirname,
        "..",
        "uploads",
        "dokumen",
        existingOpti.dokPendaftaran
      );
      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (unlinkErr) {
        console.error("Gagal menghapus dokumen pendaftaran lama:", unlinkErr);
      }
    }

    await Opti.updatePaymentProof(id, req.file.filename, connection);

    await connection.commit();
    console.log(`Dokumen pendaftaran berhasil diunggah untuk Opti ${id}`);
    res.json({
      message: "Dokumen pendaftaran berhasil diunggah.",
      filePath: `uploads/dokumen/${req.file.filename}`,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error uploading dokumen pendaftaran:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  } finally {
    connection.release();
  }
};

const getSalesDashboardData = async (req, res) => {
  const { id: idSales, role } = req.user;
  try {
    let pipelineQuery, performanceQuery, typesQuery, topWonDealsQuery;
    const performanceQueryBody = `
      SELECT
        DATE_FORMAT(won_deals.start_date, '%Y-%m') AS month,
        SUM(won_deals.value) AS totalValue
      FROM (
        SELECT p.startProject AS start_date, o.valOpti AS value, o.idSales FROM project p JOIN opti o ON p.idOpti = o.idOpti WHERE p.startProject IS NOT NULL
        UNION ALL
        SELECT t.startTraining AS start_date, o.valOpti AS value, o.idSales FROM training t JOIN opti o ON t.idOpti = o.idOpti WHERE t.startTraining IS NOT NULL
      ) AS won_deals
    `;
    if (role === "Admin" || role === "Head Sales") {
      pipelineQuery = pool.query(
        `SELECT statOpti, COUNT(*) as count FROM opti GROUP BY statOpti`
      );
      performanceQuery = pool.query(
        `${performanceQueryBody} GROUP BY month ORDER BY month ASC`
      );
      typesQuery = pool.query(
        `SELECT jenisOpti, COUNT(*) as count FROM opti GROUP BY jenisOpti`
      );
      topWonDealsQuery = pool.query(
        `
        SELECT
          won_deals.name AS nmOpti,
          won_deals.customer AS corpCustomer,
          won_deals.value AS valOpti
        FROM (
          SELECT p.nmProject AS name, c.corpCustomer AS customer, o.valOpti AS value, o.idSales
          FROM project p
          JOIN opti o ON p.idOpti = o.idOpti
          JOIN customer c ON p.idCustomer = c.idCustomer
          UNION ALL
          SELECT t.nmTraining AS name, c.corpCustomer AS customer, o.valOpti AS value, o.idSales
          FROM training t
          JOIN opti o ON t.idOpti = o.idOpti
          JOIN customer c ON t.idCustomer = c.idCustomer
        ) AS won_deals
        ORDER BY won_deals.value DESC
        LIMIT 5
      `
      );
    } else {
      const params = [idSales];
      const performanceParams = [idSales];
      pipelineQuery = pool.query(
        `SELECT statOpti, COUNT(*) as count FROM opti WHERE idSales = ? GROUP BY statOpti`,
        params
      );
      performanceQuery = pool.query(
        `${performanceQueryBody} WHERE won_deals.idSales = ? GROUP BY month ORDER BY month ASC`,
        performanceParams
      );
      typesQuery = pool.query(
        `SELECT jenisOpti, COUNT(*) as count FROM opti WHERE idSales = ? GROUP BY jenisOpti`,
        params
      );
      topWonDealsQuery = pool.query(
        `
        SELECT
          won_deals.name AS nmOpti,
          won_deals.customer AS corpCustomer,
          won_deals.value AS valOpti
        FROM (
          SELECT p.nmProject AS name, c.corpCustomer AS customer, o.valOpti AS value, o.idSales
          FROM project p
          JOIN opti o ON p.idOpti = o.idOpti
          JOIN customer c ON p.idCustomer = c.idCustomer
          UNION ALL
          SELECT t.nmTraining AS name, c.corpCustomer AS customer, o.valOpti AS value, o.idSales
          FROM training t
          JOIN opti o ON t.idOpti = o.idOpti
          JOIN customer c ON t.idCustomer = c.idCustomer
        ) AS won_deals
        WHERE won_deals.idSales = ?
        ORDER BY won_deals.value DESC
        LIMIT 5
      `,
        params
      );
    }

    const [pipelineResult, performanceResult, typesResult, topWonDealsResult] =
      await Promise.all([
        pipelineQuery,
        performanceQuery,
        typesQuery,
        topWonDealsQuery,
      ]);
    const pipelineStats = pipelineResult[0];
    const performanceOverTime = performanceResult[0];
    const opportunityTypes = typesResult[0];
    const topWonDeals = topWonDealsResult[0];
    const allPipelineStages = [
      "opti entry",
      "opti failed",
      "opti on going",
      "po received",
    ];
    const finalPipelineStats = allPipelineStages.map((stage) => {
      const found = pipelineStats.find((s) => s.statOpti === stage);
      return { statOpti: stage, count: found ? found.count : 0 };
    });
    res.json({
      pipelineStats: finalPipelineStats,
      performanceOverTime,
      opportunityTypes,
      topWonDeals,
    });
  } catch (error) {
    console.error("Error fetching sales dashboard data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createOpti,
  getOptis,
  getFormOptions,
  getOptiById,
  updateOpti,
  uploadPaymentProof,
  getSalesDashboardData,
};
