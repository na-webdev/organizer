const UserService = require("../services/user.service");
const createError = require("http-errors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const emailService = require("../services/email.service");

dotenv.config();

const signUpUser = async (req, res, next) => {
  try {
    const userData = req.body;

    const token = jwt.sign(
      {
        email: userData.email,
        username: userData.username,
        expiresIn: new Date().getTime() + 1000 * 60 * 60 * 24,
      },
      process.env.JWT_SECRET
    );

    const user = await UserService.createUser({
      username: userData.username,
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10),
      confirmationToken: token,
    });

    await emailService.sendConfirmationEmail(
      userData.username,
      userData.email,
      token
    );

    res.status(201).json({
      message: "Please check your email to confirm your account",
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(createError(422, error.message));
      return;
    }

    console.log(error);

    next(error);
  }
};

const signInUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await UserService.getUserByEmail(userData.email);

    if (!user) {
      next(createError(404, "User not found"));
      return;
    }

    if (user.active === false) {
      next(createError(401, "User is not active. Please check your email"));
      return;
    }

    if (bcrypt.compareSync(userData.password, user.password)) {
      const payload = {
        _id: user._id,
        email: user.email,
        username: user.username,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      res.status(200).json({
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(createError(422, error.message));
      return;
    }

    next(error);
  }
};

const confirmUser = async (req, res, next) => {
  try {
    const confirmationToken = req.params.token;

    const payload = jwt.decode(confirmationToken);
    if (payload.expiresIn < new Date().getTime()) {
      next(createError(401, "Token expired"));
      return;
    }

    const user = await UserService.setUserActive(confirmationToken);

    if (!user) {
      next(createError(404, "Not found"));
      return;
    }

    res.status(200).json({
      message: "User confirmed",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUpUser,
  signInUser,
  confirmUser,
};
