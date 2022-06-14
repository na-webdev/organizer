const Joi = require("joi");
const createError = require("http-errors");

const projectValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  tasks: Joi.array().items(Joi.string()),
});

const projectValidator = (req, res, next) => {
  const { error } = projectValidation.validate(req.body);

  if (error) {
    next(createError(422, error.message));
    return;
  }

  next();
};

module.exports = projectValidator;
