const express = require("express");
const router = express.Router();

const {
  signUpUser,
  signInUser,
  confirmUser,
} = require("../controllers/users.controller");
const userValidator = require("../middlewares/validators/user.validator");

router.post("/sign-up", userValidator, signUpUser);
router.post("/sign-in", signInUser);
router.post("/confirm/:token", confirmUser);

module.exports = router;
