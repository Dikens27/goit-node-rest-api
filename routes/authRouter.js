import express from "express";
import {
  register,
  login,
  logout,
  current,
} from "../controllers/authControllers.js";
import { validateBody } from "../helpers/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../schemas/authSchema.js";
import { authMiddleware } from "../helpers/authMiddleware.js";

const router = express.Router();
const jsonParser = express.json();

router.post(
  "/register",
  validateBody(registerUserSchema),
  jsonParser,
  register
);
router.post("/login", validateBody(loginUserSchema), jsonParser, login);
router.get("/logout", authMiddleware, logout);
router.get("/current", authMiddleware, current);

export default router;
