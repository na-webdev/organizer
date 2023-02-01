const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 5000;

mongoose.connect(
  process.env.MONGO_URI,
  () => console.log("MongoDB connected!"),
  (err) => console.log(err)
);

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
