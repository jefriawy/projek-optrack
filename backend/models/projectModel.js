const db = require("../config/database");

// Get all projects
const getAllProjects = async () => {
  const [rows] = await db.query("SELECT * FROM project");
  return rows;
};

// Get project by ID
const getProjectById = async (id) => {
  const [rows] = await db.query("SELECT * FROM project WHERE idProject = ?", [id]);
  return rows[0];
};

// Create project
const createProject = async (data) => {
  const {
    nmProject,
    startProject,
    endProject,
    idExpert,
    idCustomer,
    descriptionProject,
  } = data;

  const [result] = await db.query(
    `INSERT INTO project 
     (nmProject, startProject, endProject, idExpert, idCustomer, descriptionProject)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nmProject, startProject, endProject, idExpert, idCustomer, descriptionProject]
  );

  return result.insertId;
};

// Update project
const updateProject = async (id, data) => {
  const {
    nmProject,
    startProject,
    endProject,
    idExpert,
    idCustomer,
    descriptionProject,
  } = data;

  const [result] = await db.query(
    `UPDATE project SET 
     nmProject=?, startProject=?, endProject=?, idExpert=?, idCustomer=?, descriptionProject=?
     WHERE idProject=?`,
    [nmProject, startProject, endProject, idExpert, idCustomer, descriptionProject, id]
  );

  return result.affectedRows;
};

// Delete project
const deleteProject = async (id) => {
  const [result] = await db.query("DELETE FROM project WHERE idProject = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
