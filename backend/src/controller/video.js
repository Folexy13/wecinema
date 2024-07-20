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
        const { title, description, genre, theme,rating, file, author, role, slug, status,users,hasPaid} = req.body;
        // Check if the user exists
        const user = role !== "admin" ? await User.findById(author) : true;
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log(req.user);
        // Create a new video
        await Videos.create({
            title,
            description,
            genre,
            theme,
            rating,
            file,
            slug,
			users,
            status: status ?? true,
            author, //req.user._id,
			hasPaid,
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
        const videos = await Videos.find().populate("author", "username avatar followers followings");
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
        const videos = await Videos.find({ author: userId, hidden: false }).populate("author", "username avatar followers followings");
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
            ? await Videos.findById({ _id: req.params.id}).populate("author", "username avatar followers followings")
            : await Videos.findOne({ slug: req.params.id, hidden: false }).populate("author", "username avatar followers followings");
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }
        res.json(video);
    } catch (error) {
        console.error("Error getting video by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Route for publishing a video
router.patch("/publish/:id", async (req, res) => {
    try {
        const video = await Videos.findByIdAndUpdate(
            req.params.id,
            { status: true }, // Set status to true to publish
            { new: true }
        );
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }
        res.status(200).json({ message: "Video published successfully", video });
    } catch (error) {
        console.error("Error publishing video:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route for unpublishing a video
router.patch("/unpublish/:id", async (req, res) => {
    try {
        const video = await Videos.findByIdAndUpdate(
            req.params.id,
            { status: false }, // Set status to false to unpublish
            { new: true }
        );
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }
        res.status(200).json({ message: "Video unpublished successfully", video });
    } catch (error) {
        console.error("Error unpublishing video:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to hide a video by ID
router.patch("/hide/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Check if video exists
        const video = await Videos.findById(id);
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        // Update hidden status to true
        video.hidden = true;
        await video.save();

        res.status(200).json({ message: "Video hidden successfully", video });
    } catch (error) {
        console.error("Error hiding video:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to unhide a video by ID
router.patch("/unhide/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Check if video exists
        const video = await Videos.findById(id);
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        // Update hidden status to false
        video.hidden = false;
        await video.save();

        res.status(200).json({ message: "Video unhidden successfully", video });
    } catch (error) {
        console.error("Error unhiding video:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route for getting videos by rating
router.get("/ratings/:rating", async (req, res) => {
    try {
        const rating = req.params.rating;
        const videos = await Videos.find({ rating }).populate("author", "username avatar followers followings");
        res.json(videos);
    } catch (error) {
        console.error("Error getting videos by rating:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Route for getting videos by theme
router.get("/themes/:theme", async (req, res) => {
    try {
        const theme = req.params.theme;
        const videos = await Videos.find({ theme }).populate("author", "username avatar followers followings");
        res.json(videos);
    } catch (error) {
        console.error("Error getting videos by theme:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route for getting videos by theme
router.get("/search/:genre", async (req, res) => {
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
router.post('/:id/bookmark', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const video = await Videos.findById(id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Check if the user already bookmarked the video
        if (video.bookmarks.includes(userId)) {
            return res.status(400).json({ error: 'Video already bookmarked' });
        }

        // Add userId to bookmarks array
        video.bookmarks.push(userId);
        await video.save();

        res.status(200).json({ message: 'Video bookmarked successfully', video });
    } catch (error) {
        console.error('Error bookmarking video:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Remove bookmark from video
router.delete('/:id/bookmark', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const video = await Videos.findById(id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Check if the user has bookmarked the video
        if (!video.bookmarks.includes(userId)) {
            return res.status(400).json({ error: 'Video not bookmarked yet' });
        }

        // Remove userId from bookmarks array
        video.bookmarks = video.bookmarks.filter(b => b !== userId);
        await video.save();

        res.status(200).json({ message: 'Bookmark removed successfully', video });
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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
// Get video views
router.get('/views/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await Videos.findById(videoId);
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }
        res.status(200).json({ views: video.views || 0 });
    } catch (error) {
        console.error("Error fetching video views:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Increment video views
router.put('/view/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const video = await Videos.findById(videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        video.views += 1; // Increment the views count
        await video.save();
        res.status(200).json({ message: 'Video views incremented', views: video.views });
    } catch (error) {
        console.error("Error incrementing video views:", error);
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

router.patch("/change-video-status", async (req, res) => {
	try {
		// Set all users' isActive status to true
		await Videos.updateMany({}, { status: true });

		return res
			.status(200)
			.json({ message: "Video status changed successfully" });
	} catch (error) {
		console.error("Error changing video status:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

router.post("/change-video-status", async (req, res) => {
	try {
		// Update user's status
		const updatedVideo = await Videos.findByIdAndUpdate(
			req.body.videoId,
			{ status: req.body.status },
			{ new: true }
		);

		return res.status(200).json({
			message: "Video status changed successfully",
			video: updatedVideo,
		});
	} catch (error) {
		console.error("Error changing video status:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;