const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  importance: {
    type: Number,
  },
  projectRef: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
  userRef: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  plannedDate: {
    type: Date,
    default: Date.now,
  },
  weekDays: {
    type: [{ type: String }],
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
