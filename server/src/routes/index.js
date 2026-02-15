import { Router } from "express";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";
import adminRoutes from "./admin.route.js";
import songRoutes from "./song.route.js";
// import statRoutes from "./stat.route.js";
import collectionRoutes from "./collection.route.js"

const router = Router();

router.get("/", (req, res) => {
  res.send("API is Running");
});

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/songs", songRoutes);
// router.use("/stats", statRoutes);
router.use("/collections", collectionRoutes);

export default router;
