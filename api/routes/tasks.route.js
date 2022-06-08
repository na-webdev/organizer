const express = require("express");
const router = express.Router();
const taskValidator = require("../middlewares/validators/task.validator");

const {
  getAllTasks,
  addNewTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasks.controller");

router.get("/", getAllTasks);
router.post("/", taskValidator, addNewTask);
router.patch("/:id", taskValidator, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
