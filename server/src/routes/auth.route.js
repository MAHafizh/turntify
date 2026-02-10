import { Router } from "express";
import { authCallback, getMe } from "../controller/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Auth route");
});

router.post("/callback", authCallback);
router.get("/me", authUser, getMe);

export default router;
