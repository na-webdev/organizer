const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const Task = require("../../models/task.model");
const User = require("../../models/user.model");
const Project = require("../../models/project.model");

const taskInput = {
  title: "test",
  completed: false,
  plannedDate: new Date(),
  importance: 2,
};

const userInput = {
  username: "test",
  email: "gmail@gmail.com",
  password: "q@Wer1",
};

let sessionToken = "";
let taskId = "";
let userId = "";

describe("Task", () => {
  beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterAll(async () => {
    await User.findOneAndDelete({ email: userInput.email });
    await Task.findOneAndDelete({ _id: taskId });
    await mongoose.disconnect();
  });

  describe("Create session user and get its token", () => {
    test("POST users/sign-up", async () => {
      await request(app)
        .post("/users/sign-up")
        .send(userInput)
        .expect(201)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty("message");
        });
    });

    test("GET users/confirm/:token", async () => {
      let user = await User.findOne({ email: userInput.email });
      userId = user._id;
      let confirmationToken = user.confirmationToken;
      await request(app)
        .get(`/users/confirm/${confirmationToken}`)
        .expect(200)
        .expect("Content-Type", /json/);
    });

    test("POST users/sign-in", async () => {
      delete userInput.username;
      await request(app)
        .post("/users/sign-in")
        .send(userInput)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty("token");
          sessionToken = res.body.token;
        });
    });
  });

  describe("POST /tasks", () => {
    test("should create a task", async () => {
      taskInput.userRef = userId;
      await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${sessionToken}`)
        .send(taskInput)
        .expect(201)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty("_id");
          taskId = res.body._id;
        });
    });

    test("should fail to create a task", async () => {
      await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${sessionToken}`)
        .send({})
        .expect(422);
    });
  });

  describe("GET /tasks", () => {
    test("should get all user tasks", async () => {
      await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${sessionToken}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThan(0);
          res.body[0].userRef = userId;
        });
    });

    test("should fail to get all user tasks", async () => {
      await request(app).get("/tasks").expect(401);
    });
  });

  describe("PUT /tasks/reorder", () => {
    test("should reorder tasks", async () => {
      await request(app)
        .put("/tasks/reorder")
        .set("Authorization", `Bearer ${sessionToken}`)
        .send({
          listOfIds: [taskId],
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty("message");
        });
    });

    test("should fail to reorder tasks", async () => {
      await request(app)
        .put("/tasks/reorder")

        .send({
          listOfIds: [],
        })
        .expect(401);
    });
  });

  describe("PATCH /tasks/:id", () => {
    test("should update a task", async () => {
      await request(app)
        .patch(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${sessionToken}`)
        .send({
          title: "test2",
          completed: true,
          plannedDate: new Date(),
          importance: 1,
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty("_id");
          res.body._id = taskId;
        });
    });

    test("should fail to update a task", async () => {
      await request(app)
        .patch(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${sessionToken}`)
        .send({})
        .expect(422);
    });

    test("should fail to update a task", async () => {
      await request(app)
        .patch(`/tasks/${taskId}`)

        .send({
          title: "test2",
          completed: true,
          plannedDate: new Date(),
          importance: 1,
        })
        .expect(401);
    });
  });

  describe("DELETE /tasks/:id", () => {
    test("should delete a task", async () => {
      await request(app)
        .delete(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${sessionToken}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty("_id");
          res.body._id = taskId;
        });
    });

    test("should fail to delete a task", async () => {
      await request(app).delete(`/tasks/${taskId}`).expect(401);
    });

    test("should fail to delete a task", async () => {
      await request(app)
        .delete(`/tasks/${taskId}sas`)
        .set("Authorization", `Bearer ${sessionToken}`)
        .expect(422);
    });
  });
});
