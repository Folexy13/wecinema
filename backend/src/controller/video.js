const express = require("express");
const router = express.Router();

// Import your Video model (assuming you have a MongoDB Video model)
const Videos = require("../models/videos");

// Import your User model (assuming you have a MongoDB User model)
const User = require("../models/user");
const { authenticateMiddleware, isValidObjectId } = require("../utils");

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
		const video = isValidObjectId(req.params.id)
			? await Videos.findById(req.params.id)
			: await Videos.findOne({slug:req.params.id});
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

    const newComment = {
      userId,
      id:video.comments.length + 1, 
      text,
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
router.post("/:id/comment/:commentId", authenticateMiddleware, async (req, res) => {
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

    const newReply = {
      userId,
      text,
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
