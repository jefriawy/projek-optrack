// backend/controllers/projectController.js
const Project = require("../models/projectModel");
const { generateUserId } = require("../utils/idGenerator");
const pool = require("../config/database");

// GET /api/project (Admin/Expert)
const getProjects = async (_req, res) => {
  try {
    const data = await Project.getAllProjects();
    res.json(data);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/project/:id (Admin/Expert/Sales/Head Sales)
const getProjectById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        p.*,
        c.corpCustomer,
        s.nmSales,
        e.nmExpert
      FROM project p
      LEFT JOIN opti o ON o.idOpti = p.idOpti
      LEFT JOIN customer c ON c.idCustomer = p.idCustomer
      LEFT JOIN sales s    ON s.idSales    = o.idSales
      LEFT JOIN expert e   ON e.idExpert   = p.idExpert
      WHERE p.idProject = ?
      `,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Project not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /api/project (Admin)
const createProject = async (req, res) => {
  try {
    const payload = { ...req.body, idProject: await generateUserId("Project") };
    const id = await Project.createProject(payload);
    res.status(201).json({ message: "Project created", id });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT /api/project/:id (Admin)
const updateProject = async (req, res) => {
  try {
    const affectedRows = await Project.updateProject(req.params.id, req.body);
    if (affectedRows === 0) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project updated" });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE /api/project/:id (Admin)
const deleteProject = async (req, res) => {
  try {
    const affectedRows = await Project.deleteProject(req.params.id);
    if (affectedRows === 0) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getMyProjects = async (req, res) => {
  try {
    const { role, id } = req.user;

    let sql;
    let params = [];

    if (role === "Expert") {
      sql = `
        SELECT 
          p.*,
          c.corpCustomer,
          s.nmSales,
          e.nmExpert
        FROM project p
        JOIN opti o ON o.idOpti = p.idOpti AND o.statOpti = 'Success'
        LEFT JOIN customer c ON c.idCustomer = p.idCustomer
        LEFT JOIN sales s    ON s.idSales    = o.idSales
        LEFT JOIN expert e   ON e.idExpert   = p.idExpert
        WHERE (p.idExpert = ? OR o.idExpert = ?)
        ORDER BY COALESCE(p.endProject, p.startProject) DESC
      `;
      params = [id, id];
    } else if (role === "Sales") {
      sql = `
        SELECT 
          p.*,
          c.corpCustomer,
          s.nmSales,
          e.nmExpert
        FROM project p
        JOIN opti o ON o.idOpti = p.idOpti AND o.statOpti = 'Success'
        LEFT JOIN customer c ON c.idCustomer = p.idCustomer
        LEFT JOIN sales s    ON s.idSales    = o.idSales
        LEFT JOIN expert e   ON e.idExpert   = p.idExpert
        WHERE o.idSales = ?
        ORDER BY COALESCE(p.endProject, p.startProject) DESC
      `;
      params = [id];
    } else if (role === "Head Sales") {
      sql = `
        SELECT 
          p.*,
          c.corpCustomer,
          s.nmSales,
          e.nmExpert
        FROM project p
        JOIN opti o ON o.idOpti = p.idOpti AND o.statOpti = 'Success'
        LEFT JOIN customer c ON c.idCustomer = p.idCustomer
        LEFT JOIN sales s    ON s.idSales    = o.idSales
        LEFT JOIN expert e   ON e.idExpert   = p.idExpert
        ORDER BY COALESCE(p.endProject, p.startProject) DESC
      `;
    } else {
      return res.status(403).json({ error: "Unauthorized access for this route" });
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching projects for user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getMyProjects,
};
