const Project = require("../models/project.model");

class ProjectService {
  async getUserProjects(userId) {
    const projects = await Project.find({ userRef: userId }).populate({
      path: "tasks",
    });
    return projects;
  }

  async getProjectWithTasks(id, pageNumber, limit) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const project = await Project.findOne({ _id: id }).populate({
      path: "tasks",
      match: { plannedDate: { $gte: today } },
      options: {
        sort: { plannedDate: 1, importance: 1 },
        skip: limit * pageNumber,
        limit: limit,
      },
    });
    return project;
  }

  async getProjectById(id) {
    const project = await Project.findOne({ _id: id });
    return project;
  }

  async createNewProject(project) {
    const newProject = new Project(project);
    return newProject.save();
  }

  async addTaskToProject(projectId, taskId) {
    const project = await Project.findOneAndUpdate(
      { _id: projectId },
      { $push: { tasks: taskId } },
      {
        new: true,
      }
    );

    return project;
  }

  async updateProject(projectId, project) {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      project,
      {
        new: true,
      }
    );

    return updatedProject;
  }

  async deleteProject(projectId) {
    const deletedProject = await Project.findByIdAndDelete(projectId);
    return deletedProject;
  }

  async deleteTaskFromProject(projectId, taskId) {
    const project = await Project.findOneAndUpdate(
      { _id: projectId },
      { $pull: { tasks: taskId } },
      {
        new: true,
      }
    );

    return project;
  }
}

module.exports = new ProjectService();
