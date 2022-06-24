const Task = require("../models/task.model.js");

class TaskService {
  async createNewTask(task) {
    const newTask = new Task(task);
    return newTask.save();
  }

  async getUserTasks(userId) {
    const tasks = await Task.find({ userRef: userId })
      .sort({ importance: 1 })
      .populate({
        path: "projectRef",
        ref: "Project",
      });
    return tasks;
  }

  async updateTask(taskId, task) {
    const updatedTask = await Task.findOneAndUpdate({ _id: taskId }, task, {
      new: true,
    });
    return updatedTask;
  }

  async deleteTask(taskId) {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    return deletedTask;
  }
}

module.exports = new TaskService();
