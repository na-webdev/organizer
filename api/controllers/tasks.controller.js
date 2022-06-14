const mongoose = require("mongoose");
const Task = require("../models/task.model.js");
const createError = require("http-errors");

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({});
    tasks.sort((a, b) => a.importance - b.importance);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const addNewTask = async (req, res, next) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json({ _id: newTask._id });
  } catch (error) {
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

const reorderTasks = async (req, res, next) => {
  try {
    const { listOfIds } = req.body;
    listOfIds.forEach(async (_id, index) => {
      await Task.findByIdAndUpdate(_id, { importance: index });
    });
    res.status(200).json({ message: "Tasks reordered" });
  } catch (error) {
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
  reorderTasks,
};
