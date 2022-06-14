const express = require("express");
const router = express.Router();
const projectValidator = require("../middlewares/validators/project.validator");

const {
  getAllProjects,
  addNewProject,
  updateProject,
  deleteProject,
} = require("../controllers/projects.controller");

router.get("/", getAllProjects);
router.post("/", projectValidator, addNewProject);
router.patch("/:id", projectValidator, updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
