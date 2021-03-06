const mongoose = require("mongoose");
const createError = require("http-errors");
const TaskService = require("../services/task.service.js");
const CONSTANTS = require("../utils/constants");

const getUserTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const pageNumber = req.query.page || CONSTANTS.INITIAL_PAGE;
    const limit = req.query.limit || CONSTANTS.LIMIT_PER_PAGE;
    const tasks = await TaskService.getUserTasks(userId, pageNumber, limit);

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const addNewTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const newTask = await TaskService.createNewTask(
      {
        ...req.body,
        userRef: userId,
      },
      req.query.projectId
    );

    res.status(201).json({ _id: newTask._id });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(createError(422, "Invalid data"));
      return;
    }

    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const updatedTask = await TaskService.updateTask(req.params.id, req.body);

    if (!updatedTask) {
      throw createError(404, "Task not found");
    }

    res.status(200).json({ _id: updatedTask._id });
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

const reorderTasks = async (req, res, next) => {
  try {
    const { listOfIds } = req.body;
    listOfIds.forEach(async (_id, index) => {
      await TaskService.updateTask(_id, { importance: index });
    });
    res.status(200).json({ message: "Tasks reordered" });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await TaskService.deleteTask(
      req.params.id,
      req.query.projectId
    );

    if (!task) {
      throw createError(404, "Task not found");
    }

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
  getUserTasks,
  addNewTask,
  updateTask,
  deleteTask,
  reorderTasks,
};
