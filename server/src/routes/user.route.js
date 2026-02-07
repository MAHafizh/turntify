import { requireAuth, getAuth, clerkClient } from "@clerk/express";
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("User route");
});

export default router;
