import { Router } from "express";
import {
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAllAlbums,
} from "../controller/album.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);

router.use(requireAuth(), requireAdmin);
router.post("/create", createAlbum);
router.delete("/delete/:id", deleteAlbum);

export default router;
