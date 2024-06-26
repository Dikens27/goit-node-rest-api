import Joi from "joi";

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const emailSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
});
