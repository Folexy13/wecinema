const express = require("express");
const jwt = require("jsonwebtoken");

const argon2 = require("argon2");

const router = express.Router();

// Import your User model (assuming you have a MongoDB User model)
const User = require("../models/user");
const { authenticateMiddleware } = require("../utils");

// Route for creating a user account
router.post("/register", async (req, res) => {
	try {
		const { username, email, password, avatar, dob } = req.body;
		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ error: "User already exists with this email" });
		}

		// Hash the password using bcrypt
		const hashedPassword = !password
			? await argon2.hash("wecinema")
			: await argon2.hash(password);

		// Create a new user
		const newUser = await  User.create({
			username,
			email,
			password: hashedPassword,
			avatar,
			dob,
		});
		res
			.status(201)
			.json({ message: "User registered successfully", user: newUser.email });
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Route for user login and authentication
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find the user by email
		const user = await User.findOne({ email });

		// Check if the user exists
		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}
		// Compare the provided password with the hashed password in the database
		const passwordMatch = await argon2.verify(user.password,password);

		if (passwordMatch) {
			// If the passwords match, generate a JWT token for authentication
			const token = jwt.sign(
				{ userId: user._id, username: user.username, avatar: user.avatar },
				process.env.SECRET_KEY,
				{
					expiresIn: "1h",
				}
			);

			res.status(200).json({ token });
		} else {
			res.status(401).json({ error: "Invalid credentials" });
		}
	} catch (error) {
		console.error("Error during login:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.put("/:id/follow", authenticateMiddleware, async (req, res) => {
	try {
		const { action, userId } = req.body;
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({ error: "user not found" });
		}

		// Remove userId from dislikes if present and add to likes
		if (action === "follow") {
			await User.findByIdAndUpdate(req.params.id, {
				$addToSet: { followers: userId },
			});
			await User.findByIdAndUpdate(userId, {
				$addToSet: { followings: userId },
			});
		} else if (action === "unfollow") {
			// Remove userId from likes if present and add to dislikes
			await User.findByIdAndUpdate(req.params.id, {
				$pull: { followers: userId },
			});
			await User.findByIdAndUpdate(userId, {
				$pull: { followings: userId },
			});
		}

		res.json(user);
	} catch (error) {
		console.error("Error updating user by ID:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});


module.exports = router;
