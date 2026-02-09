import { Router } from "express";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";
import adminRoutes from "./admin.route.js";
import songRoutes from "./song.route.js";
import albumRoutes from "./album.route.js";
import statRoutes from "./stat.route.js";
import playlistRoutes from "./playlist.route.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("API is Running");
});

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/songs", songRoutes);
router.use("/albums", albumRoutes);
router.use("/stats", statRoutes);
router.use("/playlists", playlistRoutes);

export default router;
