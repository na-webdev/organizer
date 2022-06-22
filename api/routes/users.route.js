const express = require("express");
const router = express.Router();

const {
  signUpUser,
  signInUser,
  confirmUser,
  requestNewToken,
  getUserData,
} = require("../controllers/users.controller");
const signUpValidator = require("../middlewares/validators/sign-up.validator");
const signInValidator = require("../middlewares/validators/sign-in.validator");
const auth = require("../middlewares/guards/auth.guard");

router.get("/confirm/:token", confirmUser);
router.get("/user-data", auth, getUserData);
router.post("/sign-up", signUpValidator, signUpUser);
router.post("/sign-in", signInValidator, signInUser);
router.post("/request-new-token", requestNewToken);

module.exports = router;
