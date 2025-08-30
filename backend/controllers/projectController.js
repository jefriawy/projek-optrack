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

const getProjectById = async (req, res) => {
  try {
    const project = await Project.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
    if (affectedRows === 0) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project updated" });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
