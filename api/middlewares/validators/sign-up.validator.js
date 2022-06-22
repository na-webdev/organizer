const Joi = require("joi");

const signUpValidation = Joi.object({
  username: Joi.string().trim().min(3).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string()
    .trim()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/)
    .min(6)
    .max(16)
    .required(),
});

const signUpValidator = (req, res, next) => {
  const { error } = signUpValidation.validate(req.body);

  if (error) {
    if (error.message.includes("email")) {
      next(createError(422, "Email address is not valid"));
    }
    if (error.message.includes("password")) {
      next(createError(422, "Password is not valid"));
    }
    if (error.message.includes("username")) {
      next(createError(422, "Username is not valid"));
    }
    return;
  }

  next();
};

module.exports = signUpValidator;
