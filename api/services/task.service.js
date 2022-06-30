const Task = require("../models/task.model.js");

class TaskService {
  async createNewTask(task) {
    const newTask = new Task(task);
    return newTask.save();
  }

  async getUserTasks(userId) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tasks = await Task.find({
      userRef: userId,
      plannedDate: { $gte: today },
    })
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
