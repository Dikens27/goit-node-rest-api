import express from "express";
import { register, login } from "../controllers/authControllers.js";

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, register);
router.post("/login", jsonParser, login);

export default router;
