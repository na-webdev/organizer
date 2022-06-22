const express = require("express");
const router = express.Router();

const {
  signUpUser,
  signInUser,
  confirmUser,
  requestNewToken,
  getUserData,
} = require("../controllers/users.controller");
const userValidator = require("../middlewares/validators/user.validator");

router.post("/sign-up", userValidator, signUpUser);
router.post("/sign-in", signInUser);
router.get("/confirm/:token", confirmUser);
router.post("/request-new-token", requestNewToken);
router.get("/user-data", getUserData);

module.exports = router;
