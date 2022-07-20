const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const User = require("../../models/user.model");

let userInput = {
  username: "test",
  email: "test@gmail.com",
  password: "q@Wer1",
};

let sessionToken = "";
let confirmationToken = "";

describe("Users /users", () => {
  beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  beforeEach(async () => {
    userInput = {
      username: "test",
      email: "test@gmail.com",
      password: "q@Wer1",
    };
  });

  afterAll(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
  });

  describe("User sign-up ", () => {
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

    test("POST users/sign-up should fail", async () => {
      delete userInput.username;
      await request(app).post("/users/sign-up").send(userInput).expect(422);
    });
  });

  describe("User confirms account", () => {
    test("GET users/confirm/:token", async () => {
      let user = await User.findOne({ email: userInput.email });
      confirmationToken = user.confirmationToken;
      await request(app)
        .get(`/users/confirm/${confirmationToken}`)
        .expect(200)
        .expect("Content-Type", /json/);
    });

    test("GET users/confirm/:token should fail", async () => {
      await request(app).get(`/users/confirm/${userInput.email}`).expect(401);
    });
  });

  describe("User sign-in ", () => {
    test("POST users/sign-in", async () => {
      delete userInput.username;
      await request(app)
        .post("/users/sign-in")
        .send(userInput)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty("token");
          expect(res.body).toHaveProperty("user");
          sessionToken = res.body.token;
        });
    });

    test("POST users/sign-in should fail", async () => {
      delete userInput.username;
      userInput.email = "testmeit@gmail.com";
      await request(app).post("/users/sign-in").send(userInput).expect(404);
    });
  });

  describe("Get user data", () => {
    test("GET users/user-data", async () => {
      await request(app)
        .get("/users/user-data")
        .set("Authorization", `Bearer ${sessionToken}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty("user");
        });
    });

    test("GET users/user-data should fail", async () => {
      await request(app).get("/users/user-data").expect(401);
    });
  });

  describe("request new token", () => {
    test("POST users/request-new-token", async () => {
      await request(app)
        .post("/users/request-new-token")
        .send({ token: confirmationToken })
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty("message");
        });
    });

    test("POST users/request-new-token should fail", async () => {
      await request(app).post("/users/request-new-token").send({}).expect(401);
    });
  });
});
