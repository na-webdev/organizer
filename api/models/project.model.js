const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
