// backend/controllers/projectController.js
const Project = require("../models/projectModel");
const { generateUserId } = require("../utils/idGenerator");

const getProjects = async (req, res) => {
  try {
    const data = await Project.getAllProjects();
    res.json(data);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ====================== PERUBAHAN DI FUNGSI INI ======================
const getProjectById = async (req, res) => {
  try {
    // Memanggil fungsi dari model yang query-nya sudah lengkap
    const project = await Project.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ====================== AKHIR PERUBAHAN ======================

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

const updateProject = async (req, res) => {
  try {
    const affectedRows = await Project.updateProject(req.params.id, req.body);
    if (affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project updated" });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const affectedRows = await Project.deleteProject(req.params.id);
    if (affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const { role, id } = req.user;
    let data;
    if (role === "Expert") {
      data = await Project.getByExpertId(id);
    } else if (role === "Sales") {
      data = await Project.getBySalesId(id);
    } else if (role === "Head Sales" || role === "Head of Expert") {
      data = await Project.getAllProjects();
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized access for this route" });
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching projects for user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const submitProjectFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    if (feedback === undefined) {
      return res.status(400).json({ error: "Feedback content is required." });
    }
    const affectedRows = await Project.updateFeedback(id, feedback);
    if (affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Error submitting project feedback:", err);
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
  submitProjectFeedback,
};
