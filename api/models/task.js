let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let taskSchema = new Schema({
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
});

let Task = mongoose.model("Task", taskSchema);

module.exports = Task;
