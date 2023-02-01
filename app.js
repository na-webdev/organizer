const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

const createError = require("http-errors");
const passport = require("passport");
const auth = require("./api/middlewares/guards/auth.guard");

const tasksRouter = require("./api/routes/tasks.route.js");
const projectsRouter = require("./api/routes/projects.route.js");
const usersRouter = require("./api/routes/users.route.js");

dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(passport.initialize());

// routes
app.use("/tasks", auth, tasksRouter);
app.use("/projects", auth, projectsRouter);
app.use("/users", usersRouter);

// error handling
app.use((req, res, next) => {
  next(createError(404, "Not found"));
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: error.status,
    message: error.message,
  });
});

module.exports = app;
