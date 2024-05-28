import express from "express";
import {
  repeatVerify,
  uploadAvatar,
  verify,
} from "../controllers/usersControllers.js";
import uploadMiddleware from "../helpers/uploadMiddleware.js";
import { authMiddleware } from "../helpers/authMiddleware.js";
import { validateBody } from "../helpers/validateBody.js";
import { emailSchema } from "../schemas/authSchema.js";

const router = express.Router();

router.get("/verify/:verificationToken", verify);

router.post("/verify", validateBody(emailSchema), repeatVerify);

router.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatarURl"),
  uploadAvatar
);

export default router;
