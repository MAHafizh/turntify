import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { createPlaylist } from "../controller/playlist.controller.js";

const router = Router();

router.get("/", requireAuth(), (req, res) => {
  return res.status(200).json("Success");
});

router.post("/", requireAuth(), createPlaylist);

export default router;
