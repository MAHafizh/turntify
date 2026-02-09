import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { getAllUser } from "../controller/user.controller.js";

const router = Router();

router.get("/", requireAuth(), requireAdmin, getAllUser);

export default router;
