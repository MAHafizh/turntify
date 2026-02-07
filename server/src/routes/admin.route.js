import { Router } from "express";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { requireAuth } from "@clerk/express";

const router = Router()

router.get('/', requireAuth(), requireAdmin, (req,res)=>{
  res.send('Admin route')
})

export default router