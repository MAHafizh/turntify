import { Router } from "express";
import { authUser, requireAdmin } from "../middleware/auth.middleware.js";
import { requireAuth } from "@clerk/express";
import {
  addSongToCollection,
  createCollection,
  deleteCollection,
  getAlbumsFromCollection,
  getAlbumsFromCollectionById,
  getPlaylists,
  removeSongFromCollection,
  updatedCollection,
} from "../controller/collection.controller.js";

const router = Router();

router.use(requireAuth(), authUser);
router.get("/albums", getAlbumsFromCollection);
router.get("/albums/:id", getAlbumsFromCollectionById);
router.get("/playlists", getPlaylists);

router.post("/", createCollection);
router.patch("/:collectionId", updatedCollection);
router.delete("/:collectionId", deleteCollection);

router.patch("/:collectionId/songs/:songId", addSongToCollection);
router.delete("/:collectionId/songs/:songId", removeSongFromCollection)

export default router;
