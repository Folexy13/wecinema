const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Import your Video model (assuming you have a MongoDB Video model)
const Videos = require("../models/videos");
const Script = require("../models/script");

// Import your User model (assuming you have a MongoDB User model)
const User = require("../models/user");
const { authenticateMiddleware, isValidObjectId } = require("../utils");

// Route for creating a video
router.post("/create", async (req, res) => {
	try {
		const { title, description, genre, file, thumbnail, author, slug } =
			req.body;
		// Check if the user exists
		const user = await User.findById(author);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Create a new video
		await Videos.create({
			title,
			description,
			genre,
			file,
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
		const videos = await Videos.find().populate(
			"author",
			"username avatar followers followings "
		);

		res.json(videos);
	} catch (error) {
		console.error("Error getting all videos:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
router.get("/all/:user", async (req, res) => {
	const userId = req.params.user;

	// Check if userId is a valid ObjectId
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		return res.status(400).json({ error: "Invalid user ID" });
	}

	try {
		const videos = await Videos.find({ author: userId }).populate(
			"author",
			"username avatar followers followings"
		);

		res.json(videos);
	} catch (error) {
		console.error("Error getting all videos:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
// Route for getting a specific video by ID
router.get("/:id", async (req, res) => {
	try {
		const video = isValidObjectId(req.params.id)
			? await Videos.findById(req.params.id).populate(
					"author",
					"username avatar followers followings "
			  )
			: await Videos.findOne({ slug: req.params.id }).populate(
					"author",
					"username avatar followers followings "
			  );
		if (!video) {
			return res.status(404).json({ error: "Video not found" });
		}
		res.json(video);
	} catch (error) {
		console.error("Error getting video by ID:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Route for liking/disliking a specific video by ID
router.put("/:id", authenticateMiddleware, async (req, res) => {
	try {
		const { action, userId } = req.body;
		const video = await Videos.findById(req.params.id);

		if (!video) {
			return res.status(404).json({ error: "Video not found" });
		}

		// Remove userId from dislikes if present and add to likes
		if (action === "like") {
			await Videos.findByIdAndUpdate(req.params.id, {
				$pull: { dislikes: userId },
				$addToSet: { likes: userId },
			});
		} else if (action === "dislike") {
			// Remove userId from likes if present and add to dislikes
			await Videos.findByIdAndUpdate(req.params.id, {
				$pull: { likes: userId },
				$addToSet: { dislikes: userId },
			});
		}

		res.json(video);
	} catch (error) {
		console.error("Error updating video by ID:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Route for commenting on a video by ID
router.post("/:id/comment", authenticateMiddleware, async (req, res) => {
	try {
		const { userId, text } = req.body;
		const video = await Videos.findById(req.params.id);

		if (!video) {
			return res.status(404).json({ error: "Video not found" });
		}
		const user = await User.findById(userId);
		const newComment = {
			avatar: user.avatar,
			username: user.username,
			id: video.comments.length + 1,
			text,
			chatedAt: new Date(),
			replies: [], // Array to store replies to this comment
		};

		// Add the new comment to the video's comments array
		video.comments.push(newComment);

		// Save the updated video with the new comment
		await video.save();

		res.json(video);
	} catch (error) {
		console.error("Error commenting on video:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Route for replying to a comment on a video by ID
router.post(
	"/:id/comment/:commentId",
	authenticateMiddleware,
	async (req, res) => {
		try {
			const { userId, text } = req.body;
			const video = await Videos.findById(req.params.id);

			if (!video) {
				return res.status(404).json({ error: "Video not found" });
			}

			const comment = video.comments.find(function (el) {
				// Assuming el.id is a string, or you might need to convert it to a string
				return el.id.toString() === commentIdToFind.toString();
			});

			if (!comment) {
				return res.status(404).json({ error: "Comment not found" });
			}

			const user = await User.findById(userId);
			const newReply = {
				avatar: user.avatar,
				username: user.username,
				text,
				chatedAt: new Date(),
			};

			// Add the new reply to the comment's replies array
			comment.replies.push(newReply);

			// Save the updated video with the new reply
			await video.save();

			res.json(video);
		} catch (error) {
			console.error("Error replying to comment:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
);
// Route for getting videos by genre
router.get("/category/:genre", async (req, res) => {
	try {
		const genre = req.params.genre;

		// Use the find method to get all videos
		let videos = await Videos.find().populate(
			"author",
			"username avatar followers followings "
		);

		// Filter videos based on the specified genre
		const filteredVideos = videos.filter((video) =>
			video.genre.includes(genre)
		);

		res.json(filteredVideos);
	} catch (error) {
		console.error("Error getting videos by genre:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

//Edit video
// Route for editing a video
router.put("/edit/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, genre, file, thumbnail, author, slug } =
			req.body;

		// Find the video by ID
		let video = await Videos.findById(id);

		// Check if the video exists
		if (!video) {
			return res.status(404).json({ error: "Video not found" });
		}

		// Update the video fields if provided in the request body
		if (title) video.title = title;
		if (description) video.description = description;
		if (genre) video.genre = genre;
		if (file) video.file = file;
		if (thumbnail) video.thumbnail = thumbnail;
		if (author) video.author = author;
		if (slug) video.slug = slug;

		// Save the updated video
		await video.save();

		res.status(200).json({ message: "Video updated successfully" });
	} catch (error) {
		console.error("Error editing video:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

//Delete Video
// Route for deleting a video
router.delete("/delete/:id", async (req, res) => {
	try {
		const { id } = req.params;

		// Find the video by ID and delete
		const deletedVideo = await Videos.findByIdAndDelete(id);
		if (!deletedVideo) {
			return res.status(404).json({ error: "Video not found" });
		}

		res.status(200).json({ message: "Video deleted successfully" });
	} catch (error) {
		console.error("Error deleting video:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

//create Script
router.post("/scripts", async (req, res) => {
	try {
		const { title, genre, script, author } = req.body;
		const newScript = await Script.create({ title, genre, script, author });
		res.status(201).json(newScript);
	} catch (error) {
		console.error("Error creating script:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Route to get all scripts
router.get("/author/scripts", async (req, res) => {
	try {
		const scripts = await Script.find();
		res.status(200).json(scripts);
	} catch (error) {
		console.error("Error getting scripts:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Route to get all scripts of a specific author
router.get("/authors/:authorId/scripts", async (req, res) => {
	try {
		const authorId = req.params.authorId;
		const scripts = await Script.find({ author: authorId });
		res.status(200).json(scripts);
	} catch (error) {
		console.error("Error getting scripts by author:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
// edit script
router.put("/scripts/:id", authenticateMiddleware, async (req, res) => {
	try {
		const { id } = req.params;
		const { title, genre, script, author } = req.body;

		// Construct an object with only the provided fields
		const updateFields = {};
		if (title) updateFields.title = title;
		if (genre) updateFields.genre = genre;
		if (script) updateFields.script = script;
		if (author) updateFields.author = author;

		// Find the script by ID and update only the provided fields
		let updatedScript = await Script.findByIdAndUpdate(id, updateFields, {
			new: true,
		});

		// Check if the script exists
		if (!updatedScript) {
			return res.status(404).json({ error: "Script not found" });
		}

		res.status(200).json(updatedScript);
	} catch (error) {
		console.error("Error updating script:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// delete scripts
router.delete("/scripts/:id", authenticateMiddleware, async (req, res) => {
	try {
		const { id } = req.params;

		// Find the script by ID and delete
		const deletedScript = await Script.findByIdAndDelete(id);
		if (!deletedScript) {
			return res.status(404).json({ error: "Script not found" });
		}

		res.status(200).json({ message: "Script deleted successfully" });
	} catch (error) {
		console.error("Error deleting script:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
