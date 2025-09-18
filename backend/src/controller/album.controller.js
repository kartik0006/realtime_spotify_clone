import { Album } from "../models/album.model.js";

export const getAllAlbums = async (req, res, next) => {
	try {
		const albums = await Album.find();
		console.log("Fetched albums from DB:", albums); // 🔍 Add this
		res.status(200).json(albums);
	} catch (error) {
		next(error);
	}
};

export const getAlbumById = async (req, res, next) => {
	try {
		const { albumId } = req.params;

		const album = await Album.findById(albumId).populate("songs");

		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		res.status(200).json(album);
	} catch (error) {
		next(error);
	}
};
export const getHomeData = async (req, res) => {
	try {
		// This is example logic. You can change how you find "trending" albums.
		// Here, we get 4 recently created albums.
		const trendingAlbums = await Album.find().sort({ createdAt: -1 }).limit(4);

		// Example logic for "Made For You". Get 4 albums sorted by release year.
		const madeForYouAlbums = await Album.find().sort({ releaseYear: -1 }).limit(4);

		res.status(200).json({
			trending: trendingAlbums,
			madeForYou: madeForYouAlbums,
		});

	} catch (error) {
		// This will log the actual error to your backend terminal if something goes wrong
		console.error("Error in getHomeData:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};