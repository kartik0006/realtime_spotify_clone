// import { Router } from "express";
// import { getAlbumById, getAllAlbums } from "../controller/album.controller.js";

// const router = Router();

// router.get("/", getAllAlbums);
// router.get("/:albumId", getAlbumById);

// export default router;
// In backend/src/routes/album.routes.js

import { Router } from "express";
// 1. Import the new function here
import { getAlbumById, getAllAlbums, getHomeData } from "../controller/album.controller.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/home-data", getHomeData); // 2. <-- ADD THIS NEW ROUTE
router.get("/:albumId", getAlbumById);

export default router;