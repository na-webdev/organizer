let mongoose = require("mongoose");
let Task = require("../models/task");

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
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });
    res.status(200).json({ _id: task._id });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    let task = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ _id: task._id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  addNewTask,
  updateTask,
  deleteTask,
};
