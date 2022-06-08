let express = require("express");
let morgan = require("morgan");
let dotenv = require("dotenv");
let mongoose = require("mongoose");
let cors = require("cors");
let createError = require("http-errors");

let tasksRouter = require("./api/routes/tasks.route.js");

dotenv.config();
mongoose.connect(
  process.env.MONGO_URI,
  () => console.log("MongoDB connected!"),
  (err) => console.log(err)
);

let app = express();
let port = process.env.PORT || 5000;

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
