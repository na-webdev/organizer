const Task = require("../models/task.model.js");
const ProjectService = require("./project.service.js");

class TaskService {
  async createNewTask(task, projectId) {
    const newTask = new Task(task);
    if (projectId) {
      await ProjectService.addTaskToProject(projectId, newTask._id);
    }
    return newTask.save();
  }

  async getUserTasks(userId, pageNumber, limit) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tasks = await Task.find({
      userRef: userId,
      $or: [
        {
          plannedDate: { $gte: today },
        },
        {
          commonTask: true,
        },
      ],
    })
      .sort({ plannedDate: 1, importance: 1 })
      .populate({
        path: "projectRef",
        ref: "Project",
      })
      .skip(parseInt(pageNumber) * parseInt(limit))
      .limit(parseInt(limit));

    return tasks;
  }

  async updateTask(taskId, task) {
    const updatedTask = await Task.findOneAndUpdate({ _id: taskId }, task, {
      new: true,
    });
    return updatedTask;
  }

  async deleteTask(taskId, projectId) {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (projectId) {
      await ProjectService.deleteTaskFromProject(projectId, taskId);
    }
    return deletedTask;
  }
}

module.exports = new TaskService();
