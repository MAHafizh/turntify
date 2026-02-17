import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
  addSongToAlbum,
  createAlbum,
  deleteAlbum,
  getAlbum,
  getAlbumById,
  removeSongFromAlbum,
  updateAlbum,
} from "../controller/album.controller.js";

const router = Router();

router.use(requireAuth(), authUser);
router.get("/", getAlbum);
router.post("/", createAlbum);
router.patch("/:id", updateAlbum);
router.delete("/:id", deleteAlbum);
router.get("/:id", getAlbumById);

router.post("/:albumId/songs/:songId", addSongToAlbum);
router.patch("/:albumId/songs/:songId", removeSongFromAlbum);

export default router;
