const mongoose = require("mongoose");
const createError = require("http-errors");
const ProjectService = require("../services/project.service");
const TaskService = require("../services/task.service");

const getUserProjects = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const projects = await ProjectService.getUserProjects(userId);
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const getProjectWithTasks = async (req, res, next) => {
  try {
    const project = await ProjectService.getProjectWithTasks(req.params.id);
    if (!project) {
      throw createError(404, "Project not found");
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

const addNewProject = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const newProject = await ProjectService.createNewProject({
      ...req.body,
      userRef: userId,
    });
    res.status(201).json({ _id: newProject._id });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(createError(422, "Invalid data"));
      return;
    }

    next(error);
  }
};

const addTaskToProject = async (req, res, next) => {
  try {
    const project = await ProjectService.addTaskToProject(
      req.params.id,
      req.body.taskId
    );

    if (!project) {
      throw createError(404, "Project not found");
    }

    res.status(200).json({ _id: project._id });
  } catch (error) {
    next(error);
  }
};

const deleteTaskFromProject = async (req, res, next) => {
  try {
    const project = await ProjectService.deleteTaskFromProject(
      req.params.id,
      req.body.taskId
    );

    if (!project) {
      throw createError(404, "Project not found");
    }

    res.status(200).json({ _id: project._id });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await ProjectService.updateProject(req.params.id, req.body);

    if (!project) {
      throw createError(404, "Project not found");
    }

    res.status(200).json({ _id: project._id });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(422, "Invalid id"));
      return;
    }

    if (error instanceof mongoose.Error.ValidationError) {
      next(createError(422, "Invalid data"));
      return;
    }

    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await ProjectService.getProjectById(req.params.id);

    if (!project) {
      throw createError(404, "Project not found");
    }

    for (let i = 0; i < project.tasks.length; i++) {
      await TaskService.deleteTask(project.tasks[i]);
    }

    await ProjectService.deleteProject(req.params.id);

    res.status(200).json({ _id: req.params.id });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(422, "Invalid id"));
      return;
    }

    next(error);
  }
};

module.exports = {
  getUserProjects,
  addNewProject,
  updateProject,
  deleteProject,
  getProjectWithTasks,
  addTaskToProject,
  deleteTaskFromProject,
};
