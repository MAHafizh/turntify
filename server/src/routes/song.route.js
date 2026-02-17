import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { authUser, requireAdmin } from "../middleware/auth.middleware.js";
import {
  createSong,
  deleteSong,
  getAllSong,
  getSongById,
  getFeaturedSongs,
  getMadeForYouSongs,
  getTrendingSongs,
  updateSong,
} from "../controller/song.controller.js";

const router = Router();

router.use(requireAuth(), authUser);
router.get("/", requireAdmin, getAllSong);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/:id", getSongById);

router.post("/", createSong);
router.patch("/:id", updateSong);
router.delete("/:id", deleteSong);

export default router;
