const Outsource = require("../models/outsourceModel");

const getOutsources = async (req, res) => {
  try {
    const data = await Outsource.getAllOutsource();
    res.json(data);
  } catch (err) {
    console.error("Error fetching outsource:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOutsourceById = async (req, res) => {
  try {
    const outsource = await Outsource.getOutsourceById(req.params.id);
    if (!outsource) return res.status(404).json({ error: "Outsource not found" });
    res.json(outsource);
  } catch (err) {
    console.error("Error fetching outsource:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createOutsource = async (req, res) => {
  try {
    const id = await Outsource.createOutsource(req.body);
    res.status(201).json({ message: "Outsource created", id });
  } catch (err) {
    console.error("Error creating outsource:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateOutsource = async (req, res) => {
  try {
    const affectedRows = await Outsource.updateOutsource(req.params.id, req.body);
    if (affectedRows === 0) return res.status(404).json({ error: "Outsource not found" });
    res.json({ message: "Outsource updated" });
  } catch (err) {
    console.error("Error updating outsource:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteOutsource = async (req, res) => {
  try {
    const affectedRows = await Outsource.deleteOutsource(req.params.id);
    if (affectedRows === 0) return res.status(404).json({ error: "Outsource not found" });
    res.json({ message: "Outsource deleted" });
  } catch (err) {
    console.error("Error deleting outsource:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getOutsources,
  getOutsourceById,
  createOutsource,
  updateOutsource,
  deleteOutsource,
};
