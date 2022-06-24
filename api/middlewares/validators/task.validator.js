const Joi = require("joi");
const createError = require("http-errors");

const taskValidation = Joi.object({
  title: Joi.string().required(),
  completed: Joi.boolean(),
  importance: Joi.number(),
  projectRef: Joi.string(),
  userRef: Joi.string(),
});

const taskValidator = (req, res, next) => {
  const { error } = taskValidation.validate(req.body);

  if (error) {
    next(createError(422, error.message));
    return;
  }

  next();
};

module.exports = taskValidator;
