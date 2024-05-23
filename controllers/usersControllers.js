import * as fs from "node:fs/promises";
import path from "node:path";

import User from "../models/user.js";

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send("Please select the avatar file");
    }

    const newPath = path.resolve("public/avatars", req.file.filename);

    await fs.rename(req.file.path, newPath);

    const user = await User.findByIdAndUpdate(
      { _id: req.user.id },
      { avatarURl: req.file.filename },
      { new: true }
    );

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
}
