import mongoose from "mongoose";
import HttpError from "./HttpError.js";

export const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export const validateObjectId = (req, _, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return next(HttpError(400, "Invalid ID"));
  }
  next();
};
