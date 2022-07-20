const express = require("express");
const router = express.Router();
const projectValidator = require("../middlewares/validators/project.validator");

const {
  getUserProjects,
  addNewProject,
  updateProject,
  deleteProject,
  getProjectWithTasks,
} = require("../controllers/projects.controller");

router.get("/", getUserProjects);
router.get("/:id", getProjectWithTasks);
router.post("/", projectValidator, addNewProject);
router.patch("/:id", projectValidator, updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
