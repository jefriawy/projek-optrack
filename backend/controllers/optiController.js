// backend/controllers/optiController.js
const Opti = require("../models/opti");
const Customer = require("../models/customer");

const createOpti = async (req, res) => {
  try {
    const optiData = req.body;
    const customer = await Customer.findById(optiData.idCustomer);
    if (!customer || !customer.idSales) {
      return res
        .status(400)
        .json({ error: "Customer atau Sales terkait tidak ditemukan." });
    }
    const newOpti = await Opti.create(optiData, customer.idSales);

    res.status(201).json({ message: "Opportunity created", data: newOpti });
  } catch (error) {
    console.error("Error creating opportunity:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

const getOptis = async (req, res) => {
  try {
    const optis = await Opti.findAll();
    res.json(optis);
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

const getFormOptions = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    const sumber = await Opti.findSumberOptions();
    res.json({ customers, sumber });
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
    res.json(opti);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateOpti = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Opti.update(id, req.body);
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