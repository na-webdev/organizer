let express = require("express");
let router = express.Router();

let {
  getAllTasks,
  addNewTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasks.controller");

router.get("/", getAllTasks);
router.post("/", addNewTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
