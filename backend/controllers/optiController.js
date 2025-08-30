// backend/controllers/OptiController.js
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
 * CREATE
 * =======================*/
const createOpti = async (req, res) => {
  try {
    const b = { ...req.body };

    // validasi customer & sales
    const customer = await Customer.findById(Number(b.idCustomer));
    if (!customer || !customer.idSales) {
      return res
        .status(400)
        .json({ error: "Customer atau Sales terkait tidak ditemukan." });
    }

    const idOpti = await generateUserId("Opti");
    const optiData = {
      idOpti,
      nmOpti: b.nmOpti,
      idCustomer: Number(b.idCustomer),
      contactOpti: toNull(b.contactOpti),
      emailOpti: toNull(b.emailOpti),
      mobileOpti: toNull(b.mobileOpti),
      statOpti: b.statOpti,
      datePropOpti: b.datePropOpti, // YYYY-MM-DD
      idSumber: Number(b.idSumber),
      kebutuhan: toNull(b.kebutuhan),
      jenisOpti: b.jenisOpti, // Training | Project | Outsource
      idExpert: toNull(b.idExpert) ? Number(b.idExpert) : null,
      proposalOpti: req.file ? path.basename(req.file.filename) : null,
    };

    // Simpan OPPORTUNITY utama
    await Opti.create(optiData, customer.idSales);

    // Jika Training -> buat entri training yang terhubung dg idOpti barusan
    if (optiData.jenisOpti === "Training") {
      await Training.createTraining({
        idTraining: await generateUserId("Training"),
        idOpti, // RELASI WAJIB
        nmTraining: b.nmOpti,
        idTypeTraining: b.idTypeTraining ? Number(b.idTypeTraining) : 1,
        startTraining: toNull(b.startTraining),
        endTraining: toNull(b.endTraining),
        idExpert: toNull(b.idExpert) ? Number(b.idExpert) : null,
        placeTraining: toNull(b.placeTraining),
        examTraining: b.examTraining ? Number(b.examTraining) : 0,
        examDateTraining: toNull(b.examDateTraining),
        idCustomer: Number(b.idCustomer),
      });
    }

    res.status(201).json({ message: "Opportunity created", data: { idOpti } });
  } catch (error) {
    console.error("Error creating opportunity:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
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
    // Customers
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

    // Sumber → ambil langsung dari tabel (pasti ada kalau DB berisi)
    const [sumberRows] = await pool.query(
      "SELECT idSumber, nmSumber FROM sumber ORDER BY nmSumber ASC"
    );

    // Experts
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

    // JOIN lengkap: opti + customer + sumber + sales + expert + training + typetraining + project
    const [rows] = await pool.query(
      `SELECT
         o.*,
         c.corpCustomer,
         s.nmSumber,
         sl.nmSales,
         e.nmExpert,
         tr.idTraining,
         tr.idTypeTraining,
         tr.startTraining,
         tr.endTraining,
         tr.placeTraining,
         tt.nmTypeTraining,
         p.idProject,
         p.startProject,
         p.endProject
       FROM opti o
       LEFT JOIN customer      c  ON c.idCustomer      = o.idCustomer
       LEFT JOIN sumber        s  ON s.idSumber        = o.idSumber
       LEFT JOIN sales         sl ON sl.idSales        = o.idSales
       LEFT JOIN expert        e  ON e.idExpert        = o.idExpert
       LEFT JOIN training      tr ON tr.idOpti         = o.idOpti
       LEFT JOIN typetraining  tt ON tt.idTypeTraining = tr.idTypeTraining
       LEFT JOIN project       p  ON p.idOpti          = o.idOpti
       WHERE o.idOpti = ?
       LIMIT 1`,
      [id]
    );

    if (!rows || !rows.length) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

    const opti = rows[0];
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
  try {
    const { id } = req.params;
    const b = { ...req.body };

    const existingOpti = await Opti.findById(id);
    if (!existingOpti) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

    const optiData = {
      nmOpti: b.nmOpti,
      idCustomer: b.idCustomer ? Number(b.idCustomer) : existingOpti.idCustomer,
      contactOpti: toNull(b.contactOpti),
      emailOpti: toNull(b.emailOpti),
      mobileOpti: toNull(b.mobileOpti),
      statOpti: b.statOpti || existingOpti.statOpti,
      datePropOpti: b.datePropOpti || existingOpti.datePropOpti,
      idSumber: b.idSumber ? Number(b.idSumber) : existingOpti.idSumber,
      kebutuhan: toNull(b.kebutuhan),
      jenisOpti: b.jenisOpti || existingOpti.jenisOpti,
      idExpert: toNull(b.idExpert) ? Number(b.idExpert) : null,
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
        fs.unlink(oldFilePath, () => {});
      }
    }

    const affectedRows = await Opti.update(id, optiData);
    if (!affectedRows) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

    // Jika Training dan ada field terkait di body → update tabel training juga
    if ((b.jenisOpti || existingOpti.jenisOpti) === "Training") {
      await pool.query(
        `UPDATE training 
           SET idTypeTraining = COALESCE(?, idTypeTraining),
               startTraining  = COALESCE(?, startTraining),
               endTraining    = COALESCE(?, endTraining),
               placeTraining  = COALESCE(?, placeTraining),
               idExpert       = COALESCE(?, idExpert)
         WHERE idOpti = ?`,
        [
          b.idTypeTraining ?? null,
          toNull(b.startTraining),
          toNull(b.endTraining),
          toNull(b.placeTraining),
          toNull(b.idExpert) ? Number(b.idExpert) : null,
          id,
        ]
      );
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
