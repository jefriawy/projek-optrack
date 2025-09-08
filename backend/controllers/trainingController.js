// backend/controllers/trainingController.js
const Training = require("../models/trainingModel");
const { generateUserId } = require("../utils/idGenerator");
const pool = require("../config/database");

// GET /api/training  (Admin/Expert)
const getTraining = async (_req, res) => {
  try {
    const data = await Training.getAllTraining();
    res.json(data);
  } catch (err) {
    console.error("Error fetching training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/training/:id  (Admin/Expert/Sales/Head Sales)
const getTrainingById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        t.*,
        c.corpCustomer,
        s.nmSales,
        e.nmExpert
      FROM training t
      LEFT JOIN opti o ON o.idOpti = t.idOpti
      LEFT JOIN customer c ON c.idCustomer = t.idCustomer
      LEFT JOIN sales s    ON s.idSales    = o.idSales
      LEFT JOIN expert e   ON e.idExpert   = t.idExpert
      WHERE t.idTraining = ?
      `,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Training not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /api/training  (Admin)
const createTraining = async (req, res) => {
  try {
    const payload = { ...req.body, idTraining: await generateUserId("Training") };
    const id = await Training.createTraining(payload);
    res.status(201).json({ message: "Training created", id });
  } catch (err) {
    console.error("Error creating training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT /api/training/:id  (Admin)
const updateTraining = async (req, res) => {
  try {
    const affectedRows = await Training.updateTraining(req.params.id, req.body);
    if (affectedRows === 0) return res.status(404).json({ error: "Training not found" });
    res.json({ message: "Training updated" });
  } catch (err) {
    console.error("Error updating training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE /api/training/:id  (Admin)
const deleteTraining = async (req, res) => {
  try {
    const affectedRows = await Training.deleteTraining(req.params.id);
    if (affectedRows === 0) return res.status(404).json({ error: "Training not found" });
    res.json({ message: "Training deleted" });
  } catch (err) {
    console.error("Error deleting training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMyTrainings = async (req, res) => {
  try {
    const rawRole = req.user?.role || "";
    const role = String(rawRole).toLowerCase();

    // Ambil ID yang relevan dari token (flexibel ke berbagai skema)
    const expertId = req.user?.idExpert ?? req.user?.id ?? req.user?.userId ?? null;
    const salesId  = req.user?.idSales  ?? req.user?.id ?? req.user?.userId ?? null;

    let sql = "";
    let params = [];

    if (role === "expert") {
      if (!expertId) return res.status(400).json({ error: "Missing expert id" });

      sql = `
        SELECT DISTINCT
          t.*,
          c.corpCustomer,
          s.nmSales,
          e.nmExpert
        FROM training t
        JOIN opti o           ON o.idOpti = t.idOpti AND o.statOpti = 'Success'
        LEFT JOIN customer c  ON c.idCustomer = t.idCustomer
        LEFT JOIN sales s     ON s.idSales    = o.idSales
        LEFT JOIN expert e    ON e.idExpert   = COALESCE(t.idExpert, o.idExpert)
        WHERE (t.idExpert = ? OR o.idExpert = ?)
        ORDER BY COALESCE(t.endTraining, t.startTraining) DESC, t.idTraining DESC
      `;
      params = [expertId, expertId];

    } else if (role === "sales") {
      if (!salesId) return res.status(400).json({ error: "Missing sales id" });

      sql = `
        SELECT DISTINCT
          t.*,
          c.corpCustomer,
          s.nmSales,
          e.nmExpert
        FROM training t
        JOIN opti o           ON o.idOpti = t.idOpti AND o.statOpti = 'Success'
        LEFT JOIN customer c  ON c.idCustomer = t.idCustomer
        LEFT JOIN sales s     ON s.idSales    = o.idSales
        LEFT JOIN expert e    ON e.idExpert   = COALESCE(t.idExpert, o.idExpert)
        WHERE o.idSales = ?
        ORDER BY COALESCE(t.endTraining, t.startTraining) DESC, t.idTraining DESC
      `;
      params = [salesId];

    } else if (role === "head sales" || role === "head_sales" || role === "headsales") {
      sql = `
        SELECT DISTINCT
          t.*,
          c.corpCustomer,
          s.nmSales,
          e.nmExpert
        FROM training t
        JOIN opti o           ON o.idOpti = t.idOpti AND o.statOpti = 'Success'
        LEFT JOIN customer c  ON c.idCustomer = t.idCustomer
        LEFT JOIN sales s     ON s.idSales    = o.idSales
        LEFT JOIN expert e    ON e.idExpert   = COALESCE(t.idExpert, o.idExpert)
        ORDER BY COALESCE(t.endTraining, t.startTraining) DESC, t.idTraining DESC
      `;
      params = [];

    } else {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching training for user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getTraining,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
  getMyTrainings,
};
