import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { getAllUser } from "../controller/user.controller.js";

const router = Router();

router.get("/", requireAuth(), getAllUser); //nanti dubah ke admin, sebelum itu buat route friend dulu, baru fetch friend aja.

export default router;
