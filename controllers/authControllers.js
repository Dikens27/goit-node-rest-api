import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

export async function register(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user !== null) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({ email, password: passwordHash });

    res.status(201).send({ message: "Registration successfully" });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      throw HttpError(401, "Email or password is wrong");
    }
  } catch (error) {
    next(error);
  }

  res.send("Login");
}
