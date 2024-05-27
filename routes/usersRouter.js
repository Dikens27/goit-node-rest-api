import express from "express";
import { uploadAvatar } from "../controllers/usersControllers.js";
import uploadMiddleware from "../helpers/uploadMiddleware.js";

const router = express.Router();

router.patch("/avatars", uploadMiddleware.single("avatarURl"), uploadAvatar);

export default router;
