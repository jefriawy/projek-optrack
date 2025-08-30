// backend/controllers/optiController.js
const Opti = require("../models/opti");
const Customer = require("../models/customer");
const Expert = require("../models/expert");
const pool = require('../config/database');
const path = require('path'); // Import path module

// ➕ NEW: import Training model untuk auto-create training
const Training = require("../models/trainingModel");
const { generateUserId } = require("../utils/idGenerator");

const createOpti = async (req, res) => {
  try {
    const optiData = { ...req.body };
    if (req.file) {
      optiData.proposalOpti = req.file.filename;
    }

    // generate idOpti
    optiData.idOpti = await generateUserId("Opti");

    const customer = await Customer.findById(optiData.idCustomer);
    if (!customer || !customer.idSales) {
      return res
        .status(400)
        .json({ error: "Customer atau Sales terkait tidak ditemukan." });
    }
    const newOpti = await Opti.create(optiData, customer.idSales);

    // ⬇️ Auto-create training ketika jenisOpti = 'Training'
    if (optiData.jenisOpti === "Training") {
      // generate idTraining for the auto-created training
      const autoTrainingId = await generateUserId("Training");
      await Training.createTraining({
        idTraining: autoTrainingId,
        nmTraining: optiData.nmOpti,                // pakai nama dari Opti
        idTypeTraining: optiData.idTypeTraining || 1,
        startTraining: optiData.startTraining || null,
        endTraining: optiData.endTraining || null,
        idExpert: optiData.idExpert,                // sudah disimpan di tabel opti
        placeTraining: optiData.placeTraining || null,
        examTraining: optiData.examTraining || 0,
        examDateTraining: optiData.examDateTraining || null,
        idCustomer: optiData.idCustomer,
      });
    }

    res.status(201).json({ message: "Opportunity created", data: newOpti });
  } catch (error) {
    console.error("Error creating opportunity:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

const getOptis = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { user } = req; // Ambil user dari request

    const [optis, totalCount] = await Opti.findAllPaginated(
      searchTerm,
      limit,
      offset,
      user
    );

    // Transform proposalOpti to proposalPath for frontend
    const transformedOptis = optis.map(opti => ({
      ...opti,
      proposalPath: opti.proposalOpti ? `uploads/proposals/${opti.proposalOpti}` : null,
      proposalOpti: undefined // Remove the original field if not needed
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
      // Ambil hanya customer milik sales ini — req.user.id sudah berisi idSales
      const idSales = req.user.id;
      const [salesRow] = await pool.query("SELECT idSales FROM sales WHERE idSales = ?", [idSales]);
      if (!salesRow.length) {
        return res.status(403).json({ error: "User is not a registered sales" });
      }
      customers = await Customer.findBySalesId(idSales);
    } else {
      customers = await Customer.findAll();
    }
    const sumber = await Opti.findSumberOptions();
    const experts = await Expert.findAll();
    res.json({ customers, sumber, experts });
  } catch (error) {
    console.error("Error fetching form options:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getOptiById = async (req, res) => {
  try {
    const { id } = req.params;
    const opti = await Opti.findById(id);
    if (!opti) {
      return res.status(404).json({ error: "Opportunity not found" });
    }
    // Transform proposalOpti to proposalPath for frontend
    const transformedOpti = {
      ...opti,
      proposalPath: opti.proposalOpti ? `uploads/proposals/${opti.proposalOpti}` : null,
      proposalOpti: undefined // Remove the original field if not needed
    };
    res.json(transformedOpti);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateOpti = async (req, res) => {
  try {
    const { id } = req.params;
    const optiData = { ...req.body };
    if (req.file) {
      optiData.proposalOpti = req.file.filename;
    }

    const affectedRows = await Opti.update(id, optiData);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Opportunity not found" });
    }
    res.json({ message: "Opportunity updated" });
  } catch (error) {
    console.error("Error updating opportunity:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createOpti,
  getOptis,
  getFormOptions,
  getOptiById,
  updateOpti,
};
