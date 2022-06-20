const Joi = require("joi");

const userValidation = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userValidator = (req, res, next) => {
  const { error } = userValidation.validate(req.body);

  if (error) {
    next(createError(422, error.message));
    return;
  }

  next();
};

module.exports = userValidator;
