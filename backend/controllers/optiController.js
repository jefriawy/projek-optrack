const Opti = require("../models/opti");
const Customer = require("../models/customer");
const Expert = require("../models/expert");
const pool = require("../config/database");
const path = require("path");
const fs = require("fs");

const Training = require("../models/trainingModel");
const { generateUserId } = require("../utils/idGenerator");

const createOpti = async (req, res) => {
  try {
    const optiData = { ...req.body };
    if (req.file) {
      optiData.proposalOpti = path.basename(req.file.filename);
    }

    optiData.idOpti = await generateUserId("Opti");

    const customer = await Customer.findById(optiData.idCustomer);
    if (!customer || !customer.idSales) {
      return res
        .status(400)
        .json({ error: "Customer atau Sales terkait tidak ditemukan." });
    }

    // Simpan data opti terlebih dahulu
    await Opti.create(optiData, customer.idSales);

    // Jika jenisnya training, buat entri training yang terhubung
    if (optiData.jenisOpti === "Training") {
      const autoTrainingId = await generateUserId("Training");
      await Training.createTraining({
        idTraining: autoTrainingId,
        idOpti: optiData.idOpti, // <-- PERBAIKAN KRUSIAL: Menyertakan idOpti
        nmTraining: optiData.nmOpti,
        idTypeTraining: optiData.idTypeTraining || 1,
        startTraining: optiData.startTraining || null,
        endTraining: optiData.endTraining || null,
        idExpert: optiData.idExpert,
        placeTraining: optiData.placeTraining || null,
        examTraining: optiData.examTraining || 0,
        examDateTraining: optiData.examDateTraining || null,
        idCustomer: optiData.idCustomer,
      });
    }

    res
      .status(201)
      .json({
        message: "Opportunity created",
        data: { idOpti: optiData.idOpti },
      });
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
    const transformedOpti = {
      ...opti,
      proposalPath: opti.proposalOpti
        ? `uploads/proposals/${opti.proposalOpti}`
        : null,
      proposalOpti: undefined,
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

    const existingOpti = await Opti.findById(id);
    if (!existingOpti) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

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
        fs.unlink(oldFilePath, (err) => {
          if (err)
            console.error(
              "Error deleting old proposal file:",
              oldFilePath,
              err
            );
          else console.log("Old proposal file deleted:", oldFilePath);
        });
      }
    } else {
      optiData.proposalOpti = existingOpti.proposalOpti;
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
