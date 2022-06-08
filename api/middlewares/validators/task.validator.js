const Joi = require("joi");

const taskValidation = Joi.object({
  title: Joi.string().required(),
  completed: Joi.boolean(),
  importance: Joi.number(),
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
