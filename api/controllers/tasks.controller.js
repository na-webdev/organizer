const mongoose = require("mongoose");
const Task = require("../models/task.model.js");
const createError = require("http-errors");
const taskValidation = require("../validations/task.validation.js");

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const addNewTask = async (req, res, next) => {
  try {
    const validatedTask = await taskValidation.validate(req.body);
    const newTask = new Task(validatedTask);
    await newTask.save();
    res.status(201).json({ _id: newTask._id });
  } catch (error) {
    if (error.isJoi) error.status = 422;

    if (error instanceof mongoose.Error.ValidationError) {
      next(createError(422, error.message));
      return;
    }

    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });

    if (!task) {
      throw createError(404, "Task not found");
    }

    res.status(200).json({ _id: task._id });
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

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      throw createError(404, "Task not found");
    }

    res.status(200).json({ _id: task._id });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(422, "Invalid id"));
      return;
    }

    next(error);
  }
};

module.exports = {
  getAllTasks,
  addNewTask,
  updateTask,
  deleteTask,
};
