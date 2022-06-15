const mongoose = require("mongoose");
const createError = require("http-errors");
const Project = require("../models/project.model");

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).populate({
      path: "tasks",
    });
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id }).populate({
      path: "tasks",
    });
    project.tasks.sort((a, b) => a.importance - b.importance);
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
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json({ _id: newProject._id });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(createError(422, error.message));
      return;
    }

    next(error);
  }
};

const addTaskToProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { tasks: req.body.taskId } },
      {
        new: true,
      }
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
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { tasks: req.body.taskId } },
      {
        new: true,
      }
    );

    if (!project) {
      console.log("Project not found delete from project");
      throw createError(404, "Project not found");
    }

    res.status(200).json({ _id: project._id });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );

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
      next(createError(422, error.message));
      return;
    }

    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id });

    if (!project) {
      throw createError(404, "Project not found");
    }

    res.status(200).json({ _id: project._id });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(422, "Invalid id"));
      return;
    }

    next(error);
  }
};

module.exports = {
  getAllProjects,
  addNewProject,
  updateProject,
  deleteProject,
  getProjectById,
  addTaskToProject,
  deleteTaskFromProject,
};
