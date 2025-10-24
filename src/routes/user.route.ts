import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { getProfile } from "../controllers/user.controller.ts";

const router = Router();

router.get("/me", authMiddleware, getProfile)

export default router;