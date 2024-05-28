import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import mail from "../mail/mail.js";

export async function register(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user !== null) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const generatedAvatar = gravatar.url(email);
    const verifyToken = crypto.randomUUID();

    const newUser = await User.create({
      email,
      password: passwordHash,
      avatarURl: generatedAvatar,
      verifyToken,
    });

    const { subscription } = newUser;

    await mail.sendMail({
      to: email,
      from: "kar.karovich321@gmail.com",
      subject: "Welcome to Phone book",
      html: `To confirm your email please click on the <a href="http://localhost:3000/api/users/verify/${verifyToken}">link</a>`,
      text: `To confirm your email please open the link http://localhost:3000/api/users/verify/${verifyToken}`,
    });

    res.status(201).send({ user: { email, subscription } });
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

    if (user.verify === false) {
      throw HttpError(401, "Please verify your email");
    }

    const userInfo = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await User.findByIdAndUpdate(user._id, { token });

    res
      .status(200)
      .send({ token, user: { email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function current(req, res, next) {
  const { id } = req.user;

  try {
    const currentUser = await User.findById(id);

    if (currentUser === null) {
      throw HttpError(401);
    }

    res.status(200).send({ currentUser: { email, subscription } });
  } catch (error) {
    next(error);
  }
}
