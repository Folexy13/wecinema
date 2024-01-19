const express = require("express");
const router = express.Router();

// Import your Video model (assuming you have a MongoDB Video model)
const Videos = require("../models/videos");

// Import your User model (assuming you have a MongoDB User model)
const User = require("../models/user");
const { authenticateMiddleware } = require("../utils");

// Route for creating a video
router.post("/create", async (req, res) => {
	try {
		const { title, description, genre, file, thumbnail, author,slug  } =
			req.body;
		// Check if the user exists
		const user = await User.findById( author );
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Create a new video
	await Videos.create({
		title,
		description,
		genre,
		file,
		thumbnail,
			slug,
		author, //req.user._id,
	});
		res.status(201).json({ message: "Video created successfully" });
	} catch (error) {
		console.error("Error creating video:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Route for getting all videos
router.get("/all", async (req, res) => {
	try {
		const videos = await Videos.find().populate("author","username avatar followers");
		
		res.json(videos);
	} catch (error) {
		console.error("Error getting all videos:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
// Route for getting a specific video by ID
router.get("/:id", async (req, res) => {
	try {
		const video = await Videos.findById(req.params.id);
		if (!video) {
			return res.status(404).json({ error: "Video not found" });
		}
		res.json(video);
	} catch (error) {
		console.error("Error getting video by ID:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Route for liking a specific video by ID
router.put("/:id",authenticateMiddleware, async (req, res) => {
	try {
		const {action,userId} = req.body
		const video = await Videos.findById(req.params.id);
		if (!video) {
			return res.status(404).json({ error: "Video not found" });
		}
		if (action === "like"){
			
			await Videos.findByIdAndUpdate(req.params.id,{likes:userId});
		}
		res.json(video);
	} catch (error) {
		console.error("Error getting video by ID:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});


// Route for getting videos by genre
router.get("/:genre", async (req, res) => {
	try {
		const genre = req.params.genre;
		const videos = await Videos.find({ genre });
		res.json(videos);
	} catch (error) {
		console.error("Error getting videos by genre:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
