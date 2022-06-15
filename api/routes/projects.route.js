const express = require("express");
const router = express.Router();
const projectValidator = require("../middlewares/validators/project.validator");

const {
  getAllProjects,
  addNewProject,
  updateProject,
  deleteProject,
  getProjectById,
  addTaskToProject,
  deleteTaskFromProject,
} = require("../controllers/projects.controller");

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", projectValidator, addNewProject);
router.patch("/:id/new-task", addTaskToProject);
router.patch("/:id/delete-task", deleteTaskFromProject);
router.patch("/:id", projectValidator, updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
