// Ambil outsource yang diberikan ke outsourcer login
const getMyOutsources = async (req, res) => {
  try {
    const outsourcerId = req.user.id;
    const data = await Outsource.getByOutsourcerId(outsourcerId);
    res.json(data);
  } catch (err) {
    console.error("Error fetching my outsources:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Update penugasan outsourcer ke outsource (mirip project/experts)
const updateOutsourceOutsourcers = async (req, res) => {
  try {
    const { outsourceId } = req.params;
    const { outsourcerIds } = req.body;
    if (!Array.isArray(outsourcerIds)) {
      return res.status(400).json({ error: "outsourcerIds must be an array." });
    }
    await Outsource.updateOutsourceOutsourcers(outsourceId, outsourcerIds);
    res.json({ message: "Outsourcer assignment updated" });
  } catch (err) {
    console.error("Error updating outsource-outsourcers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const Outsource = require("../models/outsourceModel");
const { generateUserId } = require("../utils/idGenerator");

const getOutsources = async (req, res) => {
  try {
    // If the authenticated user is an Outsourcer, return only outsourcing
    // rows assigned to them via outsource_officer table.
    if (req.user && (req.user.role === "Outsourcer" || req.user.role === "external" || req.user.role === "internal")) {
      const data = await Outsource.getByOutsourcerId(req.user.id);
      return res.json(data);
    }

    // Otherwise pass the authenticated user so model can filter results for HR/Sales
    const data = await Outsource.getAllOutsource(req.user);
    res.json(data);
  } catch (err) {
    console.error("Error fetching outsource:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOutsourceById = async (req, res) => {
  try {
    // For HR users, ensure they can only access outsource assigned to them.
    const id = req.params.id;
    // Query outsource with opti info to check assignment and ownership
    const [rows] = await require("../config/database").query(
      `SELECT o.*, op.idHR, op.idSales FROM outsource o LEFT JOIN opti op ON o.idOpti = op.idOpti WHERE o.idOutsource = ? LIMIT 1`,
      [id]
    );
    const outsource = rows[0];
    if (!outsource) return res.status(404).json({ error: "Outsource not found" });
    if (req.user) {
      if (req.user.role === "HR") {
        if (!outsource.idHR || Number(outsource.idHR) !== Number(req.user.id)) {
          return res.status(403).json({ error: "Forbidden: not assigned to this HR" });
        }
      } else if (req.user.role === "Sales") {
        // Sales hanya boleh melihat outsource yang dia tambahkan
        if (!outsource.idSales || Number(outsource.idSales) !== Number(req.user.id)) {
          return res.status(403).json({ error: "Forbidden: not added by this Sales" });
        }
      }
      // Admin, Head Sales, Expert tetap bisa mengakses
    }
    // Ambil daftar outsourcer yang ditugaskan ke outsource ini
    const [assignedRows] = await require("../config/database").query(
      `SELECT oof.idOutsourcer, os.nmOutsourcer
       FROM outsource_officer oof
       JOIN outsourcer os ON oof.idOutsourcer = os.idOutsourcer
       WHERE oof.idOutsource = ?`,
      [id]
    );
    outsource.outsourcers = assignedRows;
    res.json(outsource);
  } catch (err) {
    console.error("Error fetching outsource:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createOutsource = async (req, res) => {
  try {
    const payload = { ...req.body, idOutsource: await generateUserId("Outsource") };
    const id = await Outsource.createOutsource(payload);
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
  updateOutsourceOutsourcers,
  getMyOutsources,
};
