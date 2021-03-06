const express = require("express");
const router = express.Router();
const taskValidator = require("../middlewares/validators/task.validator");

const {
  getUserTasks,
  addNewTask,
  updateTask,
  deleteTask,
  reorderTasks,
} = require("../controllers/tasks.controller");

router.get("/", getUserTasks);
router.post("/", taskValidator, addNewTask);
router.put("/reorder", reorderTasks);
router.patch("/:id", taskValidator, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
