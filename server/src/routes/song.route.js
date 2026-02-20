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
  addSongToAlbum,
  removeSongFromAlbum,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../controller/song.controller.js";

const router = Router();

router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);

router.use(requireAuth(), authUser);

router.post("/:songId/albums/:albumId", addSongToAlbum);
router.delete("/:songId/albums/:albumId", removeSongFromAlbum);

router.post("/:songId/playlists/:playlistId", addSongToPlaylist);
router.delete("/:songId/playlists/:playlistId", removeSongFromPlaylist);

router.get("/", requireAdmin, getAllSong);
router.get("/:id", getSongById);
router.post("/", createSong);
router.patch("/:id", updateSong);
router.delete("/:id", deleteSong);

export default router;
