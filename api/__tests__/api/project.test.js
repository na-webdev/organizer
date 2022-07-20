const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const User = require("../../models/user.model");
const Project = require("../../models/project.model");

const userInput = {
  username: "test",
  email: "project@gmail.com",
  password: "q@Wer1",
};

const projectInput = {
  title: "test",
  description: "test",
};

let sessionToken = "";
let projectId = "";
let userId = "";

describe("Project", () => {
  beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterAll(async () => {
    await User.findOneAndDelete({ email: userInput.email });
    await Project.deleteMany();
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

  describe("Create project", () => {
    test("POST /projects", async () => {
      await request(app)
        .post("/projects")
        .set("Authorization", `Bearer ${sessionToken}`)
        .send(projectInput)
        .expect(201)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty("_id");
          projectId = res.body._id;
        });
    });

    // fail test
    test("POST /projects should fail", async () => {
      await request(app)
        .post("/projects")
        .set("Authorization", `Bearer ${sessionToken}`)
        .send({})
        .expect(422)
        .expect("Content-Type", /json/);
    });
  });

  describe("GET /projects", () => {
    test("get all user projects", async () => {
      await request(app)
        .get("/projects")
        .set("Authorization", `Bearer ${sessionToken}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThan(0);
          res.body[0]._id = projectId;
        });
    });

    test("get user project by id", async () => {
      await request(app)
        .get(`/projects/${projectId}`)
        .set("Authorization", `Bearer ${sessionToken}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body._id).toBe(projectId);
        });
    });
  });

  describe("Update project", () => {
    test("PATCH /projects/:id", async () => {
      await request(app)
        .patch(`/projects/${projectId}`)
        .set("Authorization", `Bearer ${sessionToken}`)
        .send({ title: "test2", description: "test2" })
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body._id).toBe(projectId);
        });
    });
  });

  describe("Delete project", () => {
    test("DELETE /projects/:id", async () => {
      await request(app)
        .delete(`/projects/${projectId}`)
        .set("Authorization", `Bearer ${sessionToken}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body._id).toBe(projectId);
        });
    });
  });
});
