import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import mail from "../mail/mail.js";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      throw HttpError(400, "Please select the avatar file");
    }

    const userAvatar = await Jimp.read(req.file.path);
    await userAvatar.cover(250, 250).writeAsync(req.file.path);

    const newPath = path.join("public/avatars", req.file.filename);

    await fs.rename(req.file.path, newPath);

    const user = await User.findByIdAndUpdate(
      { _id: req.user.id },
      { avatarURl: `/avatars/${req.file.filename}` },
      { new: true }
    );

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
}

export async function verify(req, res, next) {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (user === null) {
      throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

export async function repeatVerify(req, res, next) {
  const { email } = req.body;

  try {
    if (email === null) {
      throw HttpError(400, "Missing required field email");
    }

    const user = await User.findOne({ email });
    const verifyToken = user.verificationToken;

    if (user === null) {
      throw HttpError(404, "User not found");
    }

    if (user.verify === true) {
      throw HttpError(400, "Verification has already been passed");
    }

    await mail.sendMail(email, verifyToken);

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}
