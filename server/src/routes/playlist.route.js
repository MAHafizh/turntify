import { requireAuth } from "@clerk/express";
import { Router } from "express";
import {
  addSongToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  getPlaylistById,
  removeSongFromPlaylist,
  updatePlaylist,
} from "../controller/playlist.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth());
router.get("/", authUser, getPlaylist);
router.get("/:id", getPlaylistById);
router.post("/", authUser, createPlaylist);
router.patch("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);

router.post("/:id/songs", authUser, addSongToPlaylist);
router.delete("/:id/songs/:songId", authUser, removeSongFromPlaylist);

export default router;