// backend/controllers/optiController.js

const Opti = require("../models/opti");
const Customer = require("../models/customer");
const Expert = require("../models/expert");
const pool = require("../config/database");
const path = require("path");
const fs = require("fs");
const Training = require("../models/trainingModel");
const { generateUserId } = require("../utils/idGenerator");

// helper: ubah ""/undefined -> null
const toNull = (v) => (v === "" || v === undefined ? null : v);

/* =========================
 * CREATE (Dengan Transaksi Database)
 * =======================*/
const createOpti = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const b = { ...req.body };
    const { user } = req; // Ambil user dari request yang sudah di-attach oleh middleware

    // 1. Tentukan idSales berdasarkan role
    let idSalesForOpti;
    if (user.role === 'Sales') {
      idSalesForOpti = user.id; // Sales hanya bisa membuat untuk dirinya sendiri
    } else {
      // Untuk Head Sales atau Admin, mereka harus memilih customer,
      // dan idSales diambil dari customer tersebut.
      const customer = await Customer.findById(Number(b.idCustomer));
      if (!customer || !customer.idSales) {
        await connection.rollback();
        return res
          .status(400)
          .json({ error: "Customer atau Sales terkait tidak ditemukan." });
      }
      idSalesForOpti = customer.idSales;
    }
    
    // 2. Tentukan statOpti berdasarkan role
    const statOpti = user.role === 'Sales' ? 'Just Get Info' : b.statOpti;


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
    };

    await Opti.create(optiData, idSalesForOpti, connection);

    if (optiData.jenisOpti === "Training") {
      await Training.createTraining(
        {
          idTraining: await generateUserId("Training"),
          idOpti,
          nmTraining: b.nmOpti,
          idTypeTraining: b.idTypeTraining ? Number(b.idTypeTraining) : 1,
          startTraining: toNull(b.startTraining),
          endTraining: toNull(b.endTraining),
          idExpert: toNull(b.idExpert) ? Number(b.idExpert) : null,
          placeTraining: toNull(b.placeTraining),
          examTraining: b.examTraining ? Number(b.examTraining) : 0,
          examDateTraining: toNull(b.examDateTraining),
          idCustomer: Number(b.idCustomer),
        },
        connection
      );
    }

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
      return res.status(404).json({ error: "Opportunity not found or not accessible" });
    }

    const transformedOpti = {
      ...opti,
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
 * UPDATE
 * =======================*/
const updateOpti = async (req, res) => {
  const { id } = req.params;
  const b = { ...req.body };
  const { user } = req; // Ambil user dari request

  try {
    const existingOpti = await Opti.findById(id);
    if (!existingOpti) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

    // Otorisasi: Sales hanya bisa mengubah opportunity miliknya
    if (user.role === 'Sales' && existingOpti.idSales !== user.id) {
      return res.status(403).json({ error: "Forbidden: You can only update your own opportunities." });
    }

    const optiData = {
      nmOpti: b.nmOpti,
      idCustomer: b.idCustomer ? Number(b.idCustomer) : existingOpti.idCustomer,
      contactOpti: toNull(b.contactOpti),
      emailOpti: toNull(b.emailOpti),
      mobileOpti: toNull(b.mobileOpti),
      // Sales tidak bisa mengubah status, status diambil dari data yang sudah ada
      statOpti: user.role === 'Sales' ? existingOpti.statOpti : b.statOpti,
      datePropOpti: b.datePropOpti || existingOpti.datePropOpti,
      idSumber: b.idSumber ? Number(b.idSumber) : existingOpti.idSumber,
      kebutuhan: toNull(b.kebutuhan),
      jenisOpti: b.jenisOpti || existingOpti.jenisOpti,
      idExpert: toNull(b.idExpert) ? Number(b.idExpert) : existingOpti.idExpert,
      proposalOpti: existingOpti.proposalOpti,
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
        fs.unlink(oldFilePath, () => {}); // Hapus file lama
      }
    }

    const affectedRows = await Opti.update(id, optiData);
    if (!affectedRows) {
      return res.status(404).json({ error: "Opportunity not found during update" });
    }

    // Update tabel terkait jika jenisnya "Training"
    if ((b.jenisOpti || existingOpti.jenisOpti) === "Training") {
      await pool.query(
        `UPDATE training 
           SET idTypeTraining = ?,
               startTraining  = ?,
               endTraining    = ?,
               placeTraining  = ?,
               idExpert       = ?
         WHERE idOpti = ?`,
        [
          b.idTypeTraining ?? existingOpti.idTypeTraining,
          toNull(b.startTraining) ?? existingOpti.startTraining,
          toNull(b.endTraining) ?? existingOpti.endTraining,
          toNull(b.placeTraining) ?? existingOpti.placeTraining,
          toNull(b.idExpert) ? Number(b.idExpert) : existingOpti.idExpert,
          id,
        ]
      );
    }

    res.json({ message: "Opportunity updated successfully" });
  } catch (error) {
    console.error("Error updating opportunity:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

/* =========================
 * SALES DASHBOARD
 * =======================*/
const getSalesDashboardData = async (req, res) => {
  const { id: idSales } = req.user; // Get sales ID from logged-in user

  try {
    // 1. Get pipeline stats (count per status)
    const pipelineQuery = pool.query(
      `SELECT statOpti, COUNT(*) as count 
       FROM opti 
       WHERE idSales = ? 
       GROUP BY statOpti`,
      [idSales]
    );

    // 2. Get performance over time (monthly 'Closed Won' value)
    const performanceQuery = pool.query(
      `SELECT DATE_FORMAT(datePropOpti, '%Y-%m') as month, SUM(kebutuhan) as totalValue 
       FROM opti 
       WHERE idSales = ? AND statOpti = 'Succed' 
       GROUP BY month 
       ORDER BY month ASC`,
      [idSales]
    );

    // 3. Get opportunity types breakdown
    const typesQuery = pool.query(
      `SELECT jenisOpti, COUNT(*) as count 
       FROM opti 
       WHERE idSales = ? 
       GROUP BY jenisOpti`,
      [idSales]
    );

    // 4. Get top 5 open deals
    const topDealsQuery = pool.query(
      `SELECT o.nmOpti, c.corpCustomer, o.kebutuhan 
       FROM opti o
       LEFT JOIN customer c ON o.idCustomer = c.idCustomer
       WHERE o.idSales = ? 
         AND o.statOpti NOT IN ('Closed Won', 'Closed Lost') 
       ORDER BY o.kebutuhan DESC 
       LIMIT 5`,
      [idSales]
    );

    // Run all queries in parallel
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
