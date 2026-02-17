import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { authUser, requireAdmin } from "../middleware/auth.middleware.js";
import {
  addFriend,
  addLikedSong,
  addPlaylist,
  addSavedAlbum,
  getAllUser,
  getFriend,
  removeFriend,
  removeLikedSong,
  removePlaylist,
  removeSavedAlbum,
} from "../controller/user.controller.js";

const router = Router();

router.use(requireAuth(), authUser);
router.get("/", requireAdmin, getAllUser);

router.post("/:albumId", addSavedAlbum);
router.patch("/:albumId", removeSavedAlbum);

router.post("/:playlistId", addPlaylist);
router.patch("/:playlistId", removePlaylist);

router.post("/:songId", addLikedSong);
router.patch("/:songId", removeLikedSong);

router.get("/friends", getFriend);
router.post("/friends/:friendId", addFriend);
router.patch("/friends/:friendId", removeFriend);

export default router;
