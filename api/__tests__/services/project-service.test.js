const Project = require("../../models/project.model");
const mongoose = require("mongoose");
const ProjectService = require("../../services/project.service");
const dotenv = require("dotenv");
dotenv.config();

let userId = mongoose.Types.ObjectId();
let taskId = mongoose.Types.ObjectId();

describe("Project Service", () => {
  beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterAll(async () => {
    await Project.deleteMany({});
    await mongoose.disconnect();
  });

  test("addTaskToProject", async () => {
    const project = await ProjectService.createNewProject({
      title: "Test Project",
      description: "Test Project Description",
      userRef: userId,
    });
    const projectWithTask = await ProjectService.addTaskToProject(
      project._id,
      taskId
    );
    expect(projectWithTask.tasks.length).toBe(1);
  });

  test("deleteTaskFromProject", async () => {
    const project = await ProjectService.createNewProject({
      title: "Test Project",
      description: "Test Project Description",
      userRef: userId,
    });
    const projectWithTask = await ProjectService.addTaskToProject(
      project._id,
      taskId
    );
    const projectWithoutTask = await ProjectService.deleteTaskFromProject(
      project._id,
      taskId
    );
    expect(projectWithoutTask.tasks.length).toBe(0);
  });
});
