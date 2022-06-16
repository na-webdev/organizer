const Project = require("../models/project.model");

class ProjectService {
  async getAllProjects() {
    const projects = await Project.find({}).populate({
      path: "tasks",
    });
    return projects;
  }

  async getProjectWithTasks(id) {
    const project = await Project.findOne({ _id: id }).populate({
      path: "tasks",
    });
    return project;
  }

  async getProjectById(id) {
    const project = await Project.findOne({ _id: id });
    return project;
  }

  async createNewProject(project) {
    const newProject = new Project(project);
    await newProject.save();
    return newProject;
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
