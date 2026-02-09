import { Router } from "express";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { requireAuth } from "@clerk/express";
import { successResponse } from "../utils/response.js";

const router = Router()

router.get('/', requireAuth(), requireAdmin, (req,res)=>{
  return successResponse(res, "Admin", 200)
})

export default router