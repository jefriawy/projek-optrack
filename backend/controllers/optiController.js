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

    const idOpti = await generateUserId("Opti");

    // Prepare data for the new schema
    const optiData = {
      idOpti,
      nmOpti: b.nmOpti,
      idCustomer: Number(b.idCustomer),
      contactOpti: toNull(b.contactOpti),
      emailOpti: toNull(b.emailOpti),
      mobileOpti: toNull(b.mobileOpti),
      statOpti: 'Entry', // Default status
      datePropOpti: b.datePropOpti,
      idSumber: Number(b.idSumber),
      kebutuhan: toNull(b.kebutuhan),
      jenisOpti: b.jenisOpti,
      idExpert: toNull(b.idExpert) ? Number(b.idExpert) : null,
      valOpti:
        b.valOpti !== undefined && b.valOpti !== "" ? Number(b.valOpti) : null,
      
      // New program-related fields
      startProgram: toNull(b.startTraining),
      endProgram: toNull(b.endTraining),
      placeProgram: toNull(b.placeTraining),
      idTypeTraining: b.jenisOpti === 'Training' ? (toNull(b.idTypeTraining) ? Number(b.idTypeTraining) : null) : null,
      idTypeProject: b.jenisOpti === 'Project' ? (toNull(b.idTypeTraining) ? Number(b.idTypeTraining) : null) : null,

      // File uploads
      proposalOpti: null,
      buktiPembayaran: null,
    };

    if (req.file) {
      if (user.role === 'Sales') {
        optiData.statOpti = 'Delivered';
        optiData.buktiPembayaran = path.basename(req.file.filename);
      } else {
        optiData.proposalOpti = path.basename(req.file.filename);
      }
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

    // Authorization Check
    if (user.role === "Sales" && existingOpti.idSales !== user.id) {
      await connection.rollback();
      return res
        .status(403)
        .json({ error: "Forbidden: You can only update your own opportunities." });
    }

    // Prepare data for the new schema
    const optiData = {
      nmOpti: b.nmOpti || existingOpti.nmOpti,
      idCustomer: b.idCustomer ? Number(b.idCustomer) : existingOpti.idCustomer,
      contactOpti: toNull(b.contactOpti) ?? existingOpti.contactOpti,
      emailOpti: toNull(b.emailOpti) ?? existingOpti.emailOpti,
      mobileOpti: toNull(b.mobileOpti) ?? existingOpti.mobileOpti,
      statOpti: b.statOpti || existingOpti.statOpti,
      datePropOpti: b.datePropOpti || existingOpti.datePropOpti,
      idSumber: b.idSumber ? Number(b.idSumber) : existingOpti.idSumber,
      kebutuhan: toNull(b.kebutuhan) ?? existingOpti.kebutuhan,
      jenisOpti: b.jenisOpti || existingOpti.jenisOpti,
      idExpert: toNull(b.idExpert) ? Number(b.idExpert) : existingOpti.idExpert,
      valOpti:
        b.valOpti !== undefined && b.valOpti !== ""
          ? Number(b.valOpti)
          : existingOpti.valOpti,
      
      startProgram: toNull(b.startTraining) ?? existingOpti.startProgram,
      endProgram: toNull(b.endTraining) ?? existingOpti.endProgram,
      placeProgram: toNull(b.placeTraining) ?? existingOpti.placeProgram,
      
      idTypeTraining: b.jenisOpti === 'Training' ? (toNull(b.idTypeTraining) ? Number(b.idTypeTraining) : existingOpti.idTypeTraining) : existingOpti.idTypeTraining,
      idTypeProject: b.jenisOpti === 'Project' ? (toNull(b.idTypeTraining) ? Number(b.idTypeTraining) : existingOpti.idTypeProject) : existingOpti.idTypeProject,

      proposalOpti: existingOpti.proposalOpti,
      buktiPembayaran: existingOpti.buktiPembayaran,
    };

    if (req.file) {
      if (user.role === 'Sales') {
        optiData.statOpti = 'Delivered';
        optiData.buktiPembayaran = path.basename(req.file.filename);
        if (existingOpti.buktiPembayaran) {
          const oldFilePath = path.join(__dirname, "..", "uploads", "proposals", existingOpti.buktiPembayaran);
          fs.unlink(oldFilePath, () => {});
        }
      } else {
        optiData.proposalOpti = path.basename(req.file.filename);
        if (existingOpti.proposalOpti) {
          const oldFilePath = path.join(__dirname, "..", "uploads", "proposals", existingOpti.proposalOpti);
          fs.unlink(oldFilePath, () => {});
        }
      }
    }
    
    if (user.role !== 'Sales' && b.idExpert && !existingOpti.idExpert) {
        optiData.statOpti = 'PO Received';
    }

    await Opti.update(id, optiData, connection);

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

    // Map new DB columns back to old form field names for frontend compatibility
    const transformedOpti = {
      ...opti,
      startTraining: opti.startProgram ?? null,
      endTraining: opti.endProgram ?? null,
      placeTraining: opti.placeProgram ?? null,
      // The form reuses idTypeTraining for both projects and trainings
      idTypeTraining: opti.idTypeTraining ?? opti.idTypeProject ?? null,
      
      proposalPath: opti.proposalOpti
        ? `uploads/proposals/${opti.proposalOpti}`
        : null,
      buktiPembayaranPath: opti.buktiPembayaran
        ? `uploads/proposals/${opti.buktiPembayaran}` // Assuming same folder
        : null,
    };
    // Clean up fields that are not directly on the form
    delete transformedOpti.proposalOpti;
    delete transformedOpti.buktiPembayaran;
    delete transformedOpti.startProgram;
    delete transformedOpti.endProgram;
    delete transformedOpti.placeProgram;
    delete transformedOpti.idTypeProject;


    res.json(transformedOpti);
  } catch (error) {
    console.error("Error fetching opportunity detail:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getSalesDashboardData = async (req, res) => {
  const { id: idSales, role } = req.user;

  try {
    let pipelineQuery, performanceQuery, typesQuery, topWonDealsQuery;

    // Subquery to get IDs of opportunities that are "Closed Won" (i.e., have become a project or training)
    const wonOptiIdsSubquery = `
      SELECT idOpti FROM training WHERE idOpti IS NOT NULL
      UNION
      SELECT idOpti FROM project WHERE idOpti IS NOT NULL
    `;

    // Query baru untuk performa bulanan (Closed Won)
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

    if (role === 'Admin' || role === 'Head Sales') {
      pipelineQuery = pool.query(`SELECT statOpti, COUNT(*) as count FROM opti GROUP BY statOpti`);
      
      performanceQuery = pool.query(`${performanceQueryBody} GROUP BY month ORDER BY month ASC`);
      
      typesQuery = pool.query(`SELECT jenisOpti, COUNT(*) as count FROM opti GROUP BY jenisOpti`);
      
      topWonDealsQuery = pool.query(`
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
      `);

    } else { // Sales
      const params = [idSales];
      const performanceParams = [idSales];
      pipelineQuery = pool.query(`SELECT statOpti, COUNT(*) as count FROM opti WHERE idSales = ? GROUP BY statOpti`, params);
      
      performanceQuery = pool.query(`${performanceQueryBody} WHERE won_deals.idSales = ? GROUP BY month ORDER BY month ASC`, performanceParams);
      
      typesQuery = pool.query(`SELECT jenisOpti, COUNT(*) as count FROM opti WHERE idSales = ? GROUP BY jenisOpti`, params);
      
      topWonDealsQuery = pool.query(`
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
      `, params);
    }

    const [
      pipelineResult,
      performanceResult,
      typesResult,
      topWonDealsResult,
    ] = await Promise.all([
      pipelineQuery,
      performanceQuery,
      typesQuery,
      topWonDealsQuery,
    ]);

    const pipelineStats = pipelineResult[0];
    const performanceOverTime = performanceResult[0];
    const opportunityTypes = typesResult[0];
    const topWonDeals = topWonDealsResult[0];

    const allPipelineStages = ['Entry', 'Delivered', 'PO Received', 'Reject'];
    const finalPipelineStats = allPipelineStages.map(stage => {
      const found = pipelineStats.find(s => s.statOpti === stage);
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
  getSalesDashboardData,
};