let express = require("express");
let morgan = require("morgan");
let dotenv = require("dotenv");
let mongoose = require("mongoose");
let cors = require("cors");

let tasksRouter = require("./api/routes/tasks.js");

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
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
