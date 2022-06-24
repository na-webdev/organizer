const Joi = require("joi");
const createError = require("http-errors");

const signInValidation = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string()
    .trim()
    .min(6)
    .max(16)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/)
    .required(),
});

const signInValidator = (req, res, next) => {
  const { error } = signInValidation.validate(req.body);

  if (error) {
    next(createError(422, "Wrong email or password"));
    return;
  }

  next();
};

module.exports = signInValidator;
