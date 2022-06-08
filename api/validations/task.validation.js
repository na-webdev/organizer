const Joi = require("joi");

const taskValidation = Joi.object({
  title: Joi.string().required(),
  completed: Joi.boolean(),
  importance: Joi.number(),
});

module.exports = taskValidation;
