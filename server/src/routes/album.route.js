import { Router } from "express";
import {
  addSongToAlbum,
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAllAlbums,
  removeSongFromAlbum,
  updateAlbum,
} from "../controller/album.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);

router.use(requireAuth(), requireAdmin);
router.post("/", createAlbum);
router.patch("/:id", updateAlbum);
router.delete("/:id", deleteAlbum);
router.post("/:id/songs/", addSongToAlbum);
router.delete("/:id/songs/:songId", removeSongFromAlbum);

export default router;
