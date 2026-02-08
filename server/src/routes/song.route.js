import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { requireAdmin } from "../middleware/auth.middleware.js";
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

router.get("/", requireAdmin, getAllSong);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/:id", getSongById);

router.use(requireAuth(), requireAdmin);
router.post("/create", createSong);
router.delete("/delete/:id", deleteSong);
router.put("/update/:id", updateSong);

export default router;
