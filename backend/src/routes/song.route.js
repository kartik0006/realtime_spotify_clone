// import { Router } from "express";
// import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs } from "../controller/song.controller.js";
// import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

// const router = Router();

// router.get("/", getAllSongs);
// router.get("/featured", getFeaturedSongs);
// router.get("/made-for-you", getMadeForYouSongs);
// router.get("/trending", getTrendingSongs);

// export default router;import { Router } from "express";
import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs } from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Protected admin route - needs authentication
router.get("/", protectRoute, requireAdmin, getAllSongs);

// Public routes - no authentication required
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);

export default router;