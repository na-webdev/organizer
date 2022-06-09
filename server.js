const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const createError = require("http-errors");

const tasksRouter = require("./api/routes/tasks.route.js");

dotenv.config();
mongoose.connect(
  process.env.MONGO_URI,
  () => console.log("MongoDB connected!"),
  (err) => console.log(err)
);

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// routes
app.use("/tasks", tasksRouter);

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

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});