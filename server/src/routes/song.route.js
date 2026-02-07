import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { createSong, deleteSong } from "../controller/song.controller.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Song route");
});

router.post("/create", requireAuth(), requireAdmin, createSong);

router.delete("/delete/:id", requireAuth(), requireAdmin, deleteSong);

export default router;
