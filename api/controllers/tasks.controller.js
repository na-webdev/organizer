let mongoose = require("mongoose");
let Task = require("../models/task.model.js");
let createError = require("http-errors");

const getAllTasks = async (req, res, next) => {
  try {
    let tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const addNewTask = async (req, res, next) => {
  try {
    let newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json({ _id: newTask._id });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.log(error.message);
      next(createError(400, error.message));
      return;
    }

    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });

    if (!task) {
      throw createError(404, "Task not found");
    }

    res.status(200).json({ _id: task._id });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(400, "Invalid id"));
      return;
    }

    if (error instanceof mongoose.Error.ValidationError) {
      next(createError(400, error.message));
      return;
    }

    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    let task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      throw createError(404, "Task not found");
    }

    res.status(200).json({ _id: task._id });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(400, "Invalid id"));
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
