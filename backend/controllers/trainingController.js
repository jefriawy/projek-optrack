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
    const training = await Training.getTrainingById(req.params.id);
    if (!training) {
      return res.status(404).json({ error: "Training not found" });
    }
    res.json(training);
  } catch (err) {
    console.error("Error fetching training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /api/training  (Admin) — buat manual
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
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Training not found" });
    }
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
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Training not found" });
    }
    res.json({ message: "Training deleted" });
  } catch (err) {
    console.error("Error deleting training:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/training/mine (Expert/Sales/Head Sales)
// ⚠️ Hanya kirim training yang parent OPTI-nya sudah Success
const getMyTrainings = async (req, res) => {
  try {
    const { role, id } = req.user;

    let sql, params;
    if (role === "Expert") {
      sql = `
        SELECT 
          t.*,
          c.corpCustomer,
          s.nmSales,
          e.nmExpert
        FROM training t
        JOIN opti o   ON o.idOpti = t.idOpti AND o.statOpti = 'Success'
        LEFT JOIN customer c ON c.idCustomer = t.idCustomer
        LEFT JOIN sales s    ON s.idSales    = o.idSales
        LEFT JOIN expert e   ON e.idExpert   = t.idExpert
        WHERE t.idExpert = ?
        ORDER BY COALESCE(t.endTraining, t.startTraining) DESC
      `;
      params = [id];
    } else if (role === "Sales") {
      sql = `
        SELECT 
          t.*,
          c.corpCustomer,
          s.nmSales,
          e.nmExpert
        FROM training t
        JOIN opti o   ON o.idOpti = t.idOpti AND o.statOpti = 'Success'
        LEFT JOIN customer c ON c.idCustomer = t.idCustomer
        LEFT JOIN sales s    ON s.idSales    = o.idSales
        LEFT JOIN expert e   ON e.idExpert   = t.idExpert
        WHERE o.idSales = ?
        ORDER BY COALESCE(t.endTraining, t.startTraining) DESC
      `;
      params = [id];
    } else if (role === "Head Sales") {
      sql = `
        SELECT 
          t.*,
          c.corpCustomer,
          s.nmSales,
          e.nmExpert
        FROM training t
        JOIN opti o   ON o.idOpti = t.idOpti AND o.statOpti = 'Success'
        LEFT JOIN customer c ON c.idCustomer = t.idCustomer
        LEFT JOIN sales s    ON s.idSales    = o.idSales
        LEFT JOIN expert e   ON e.idExpert   = t.idExpert
        ORDER BY COALESCE(t.endTraining, t.startTraining) DESC
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
