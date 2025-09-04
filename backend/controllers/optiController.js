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

/* =========================
 * CREATE (LOGIKA DIPINDAHKAN)
 * =======================*/
const createOpti = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
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

    const statOpti = user.role === "Sales" ? "Just Get Info" : b.statOpti;
    const idOpti = await generateUserId("Opti");
    const optiData = {
      idOpti,
      nmOpti: b.nmOpti,
      idCustomer: Number(b.idCustomer),
      contactOpti: toNull(b.contactOpti),
      emailOpti: toNull(b.emailOpti),
      mobileOpti: toNull(b.mobileOpti),
      statOpti: statOpti,
      datePropOpti: b.datePropOpti,
      idSumber: Number(b.idSumber),
      kebutuhan: toNull(b.kebutuhan),
      jenisOpti: b.jenisOpti,
      idExpert: toNull(b.idExpert) ? Number(b.idExpert) : null,
      proposalOpti: req.file ? path.basename(req.file.filename) : null,
      valOpti:
        b.valOpti !== undefined && b.valOpti !== "" ? Number(b.valOpti) : null,
    };

    await Opti.create(optiData, idSalesForOpti, connection);

    // LOGIKA UNTUK MEMBUAT TRAINING/PROJECT DIHAPUS DARI SINI
    // Pembuatan record akan ditangani oleh fungsi updateOpti saat status menjadi 'Success'

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

/* =========================
 * UPDATE (LOGIKA BARU DITAMBAHKAN)
 * =======================*/
const updateOpti = async (req, res) => {
  const { id } = req.params;
  const b = { ...req.body };
  const { user } = req;

  const connection = await pool.getConnection(); // Mulai transaksi
  try {
    await connection.beginTransaction();

    const existingOpti = await Opti.findById(id, user);
    if (!existingOpti) {
      await connection.rollback();
      return res.status(404).json({ error: "Opportunity not found" });
    }

    if (user.role === "Sales" && existingOpti.idSales !== user.id) {
      await connection.rollback();
      return res
        .status(403)
        .json({
          error: "Forbidden: You can only update your own opportunities.",
        });
    }

    const optiData = {
      nmOpti: b.nmOpti || existingOpti.nmOpti,
      idCustomer: b.idCustomer ? Number(b.idCustomer) : existingOpti.idCustomer,
      contactOpti: toNull(b.contactOpti),
      emailOpti: toNull(b.emailOpti),
      mobileOpti: toNull(b.mobileOpti),
      statOpti: user.role === "Sales" ? existingOpti.statOpti : b.statOpti,
      datePropOpti: b.datePropOpti || existingOpti.datePropOpti,
      idSumber: b.idSumber ? Number(b.idSumber) : existingOpti.idSumber,
      kebutuhan: toNull(b.kebutuhan),
      jenisOpti: b.jenisOpti || existingOpti.jenisOpti,
      idExpert: toNull(b.idExpert) ? Number(b.idExpert) : existingOpti.idExpert,
      proposalOpti: existingOpti.proposalOpti,
      valOpti:
        b.valOpti !== undefined && b.valOpti !== ""
          ? Number(b.valOpti)
          : existingOpti.valOpti,
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

    await Opti.update(id, optiData, connection); // Kirim connection ke model

    // ===== LOGIKA BARU: BUAT TRAINING/PROJECT SAAT STATUS MENJADI SUCCESS =====
    if (b.statOpti === "Success" && existingOpti.statOpti !== "Success") {
      const idOpti = id;

      if (existingOpti.jenisOpti === "Training") {
        const [trainings] = await connection.query(
          "SELECT idTraining FROM training WHERE idOpti = ?",
          [idOpti]
        );
        if (trainings.length === 0) {
          // Hanya buat jika belum ada
          await Training.createTraining(
            {
              idTraining: await generateUserId("Training"),
              idOpti,
              nmTraining: optiData.nmOpti,
              idTypeTraining: b.idTypeTraining
                ? Number(b.idTypeTraining)
                : existingOpti.idTypeTraining || 1,
              startTraining:
                toNull(b.startTraining) || toNull(existingOpti.startTraining),
              endTraining:
                toNull(b.endTraining) || toNull(existingOpti.endTraining),
              idExpert: optiData.idExpert,
              placeTraining:
                toNull(b.placeTraining) || toNull(existingOpti.placeTraining),
              idCustomer: optiData.idCustomer,
            },
            connection
          );
        }
      } else if (existingOpti.jenisOpti === "Project") {
        const [projects] = await connection.query(
          "SELECT idProject FROM project WHERE idOpti = ?",
          [idOpti]
        );
        if (projects.length === 0) {
          // Hanya buat jika belum ada
          await Project.createProject(
            {
              idProject: await generateUserId("Project"),
              idOpti,
              nmProject: optiData.nmOpti,
              idTypeProject: b.idTypeTraining
                ? Number(b.idTypeTraining)
                : existingOpti.idTypeProject || 1,
              startProject:
                toNull(b.startTraining) || toNull(existingOpti.startProject),
              endProject:
                toNull(b.endTraining) || toNull(existingOpti.endProject),
              placeProject:
                toNull(b.placeTraining) || toNull(existingOpti.placeProject),
              idCustomer: optiData.idCustomer,
              idSales: existingOpti.idSales,
              idExpert: optiData.idExpert,
            },
            connection
          );
        }
      }
    }

    // Logika untuk update detail training/project yang sudah ada
    if ((b.jenisOpti || existingOpti.jenisOpti) === "Training") {
      await connection.query(
        `UPDATE training SET idTypeTraining = ?, startTraining  = ?, endTraining = ?, placeTraining  = ?, idExpert = ? WHERE idOpti = ?`,
        [
          b.idTypeTraining ?? existingOpti.idTypeTraining,
          toNull(b.startTraining) ?? existingOpti.startTraining,
          toNull(b.endTraining) ?? existingOpti.endTraining,
          toNull(b.placeTraining) ?? existingOpti.placeTraining,
          toNull(b.idExpert) ? Number(b.idExpert) : existingOpti.idExpert,
          id,
        ]
      );
    } // Bisa ditambahkan 'else if' untuk update project jika diperlukan

    await connection.commit(); // Commit transaksi
    res.json({ message: "Opportunity updated successfully" });
  } catch (error) {
    await connection.rollback(); // Rollback jika ada error
    console.error("Error updating opportunity:", error);
    res
      .status(500)
      .json({ error: "Server error", details: error.message || String(error) });
  } finally {
    connection.release(); // Selalu lepaskan koneksi
  }
};

// ... (sisa kode controller seperti getOptis, getFormOptions, dll. tetap sama) ...
/* =========================
 * LIST (paginated)
 * =======================*/
const getOptis = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { user } = req;

    const [optis, totalCount] = await Opti.findAllPaginated(
      searchTerm,
      limit,
      offset,
      user
    );
    const transformedOptis = optis.map((opti) => ({
      ...opti,
      proposalPath: opti.proposalOpti
        ? `uploads/proposals/${opti.proposalOpti}`
        : null,
      proposalOpti: undefined,
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
/* =========================
 * FORM OPTIONS (customers/sumber/experts)
 * =======================*/
const getFormOptions = async (req, res) => {
  try {
    let customers;
    if (req.user.role === "Sales") {
      const idSales = req.user.id;
      const [salesRow] = await pool.query(
        "SELECT idSales FROM sales WHERE idSales = ?",
        [idSales]
      );
      if (!salesRow.length) {
        return res
          .status(403)
          .json({ error: "User is not a registered sales" });
      }
      customers = await Customer.findBySalesId(idSales);
    } else {
      customers = await Customer.findAll();
    }

    const [sumberRows] = await pool.query(
      "SELECT idSumber, nmSumber FROM sumber ORDER BY nmSumber ASC"
    );
    const experts = await Expert.findAll();
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
/* =========================
 * DETAIL (JOIN lengkap)
 * =======================*/
const getOptiById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req; // Ambil user dari request

    const opti = await Opti.findById(id, user);
    if (!opti) {
      return res
        .status(404)
        .json({ error: "Opportunity not found or not accessible" });
    }

    const transformedOpti = {
      ...opti,
      idTypeTraining: opti.idTypeTraining ?? null,
      startTraining: opti.startTraining ?? null,
      endTraining: opti.endTraining ?? null,
      placeTraining: opti.placeTraining ?? null,
      proposalPath: opti.proposalOpti
        ? `uploads/proposals/${opti.proposalOpti}`
        : null,
    };
    delete transformedOpti.proposalOpti;

    res.json(transformedOpti);
  } catch (error) {
    console.error("Error fetching opportunity detail:", error);
    res.status(500).json({ error: "Server error" });
  }
};
/* =========================
 * SALES DASHBOARD
 * =======================*/
const getSalesDashboardData = async (req, res) => {
  const { id: idSales } = req.user;

  try {
    const pipelineQuery = pool.query(
      `SELECT statOpti, COUNT(*) as count FROM opti WHERE idSales = ? GROUP BY statOpti`,
      [idSales]
    );
    const performanceQuery = pool.query(
      `SELECT DATE_FORMAT(datePropOpti, '%Y-%m') as month, SUM(kebutuhan) as totalValue FROM opti WHERE idSales = ? AND statOpti = 'Succed' GROUP BY month ORDER BY month ASC`,
      [idSales]
    );
    const typesQuery = pool.query(
      `SELECT jenisOpti, COUNT(*) as count FROM opti WHERE idSales = ? GROUP BY jenisOpti`,
      [idSales]
    );
    const topDealsQuery = pool.query(
      `SELECT o.nmOpti, c.corpCustomer, o.kebutuhan FROM opti o LEFT JOIN customer c ON o.idCustomer = c.idCustomer WHERE o.idSales = ? AND o.statOpti NOT IN ('Closed Won', 'Closed Lost') ORDER BY o.kebutuhan DESC LIMIT 5`,
      [idSales]
    );

    const [
      [pipelineStats],
      [performanceOverTime],
      [opportunityTypes],
      [topOpenDeals],
    ] = await Promise.all([
      pipelineQuery,
      performanceQuery,
      typesQuery,
      topDealsQuery,
    ]);

    res.json({
      pipelineStats,
      performanceOverTime,
      opportunityTypes,
      topOpenDeals,
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
  getSalesDashboardData,
};
