import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";

import User from "../models/user.js";

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send("Please select the avatar file");
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
