import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
  addCollaboratorToPlaylist,
  addSongToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  getPlaylistById,
  removeCollaboratorFromPlaylist,
  removeSongFromPlaylist,
  updatePlaylist,
} from "../controller/playlist.controller.js";

const router = Router();

router.use(requireAuth(), authUser);
router.get("/", getPlaylist);
router.post("/", createPlaylist);
router.patch("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);
router.get("/:id", getPlaylistById);

router.post("/:playlistId/songs/:songId", addSongToPlaylist);
router.patch("/:playlistId/songs/:songId", removeSongFromPlaylist);

router.post("/:playlistId/users/:collaboratorId", addCollaboratorToPlaylist);
router.patch("/:playlistId/users/:collaboratorId", removeCollaboratorFromPlaylist);

export default router;
