const express = require("express");
const jwt = require("jsonwebtoken");

const argon2 = require("argon2");
const axios = require('axios');
const router = express.Router();
// Import your User model (assuming you have a MongoDB User model)
const User = require("../models/user");
const Contact = require("../models/contact");
const Subscription  = require("../models/subscription");
const Transaction = require("../models/transaction"); 
const admin = require('firebase-admin');



const { authenticateMiddleware, isAdmin } = require("../utils");
router.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Create a new contact message
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ message: "Contact message sent successfully" });
    } catch (error) {
        console.error("Error handling contact form submission:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// User registration route
router.post('/register', async (req, res) => {
	const { username, email, avatar } = req.body;
	
	try {
	  const userRecord = await admin.auth().createUser({
		email,
		displayName: username,
		photoURL: avatar,
	  });
  
	  const token = await admin.auth().createCustomToken(userRecord.uid);
  
	  res.status(201).json({
		message: 'User registered successfully',
		id: userRecord.uid,
		token
	  });
	} catch (error) {
	  console.error('Error creating new user:', error);
	  res.status(400).json({ error: error.message });
	}
  });
  
  // User login route
  router.post('/login', async (req, res) => {
	const { token } = req.body;
  
	try {
	  const decodedToken = await admin.auth().verifyIdToken(token);
	  res.status(200).json({
		message: 'User logged in successfully',
		id: decodedToken.uid,
		token
	  });
	} catch (error) {
	  console.error('Error logging in user:', error);
	  res.status(400).json({ error: 'Invalid token' });
	}
  });
  
  

//Route for following an author
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
// New route to get paid users (should be before /user/:id)
router.get('/paid-users', async (req, res) => {
    try {
        const paidUsers = await User.find({ hasPaid: true }).lean();
        res.status(200).json(paidUsers);
    } catch (error) {
        console.error('Error fetching paid users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for getting a particular user
router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const age = new User(user).calculateAge();
        let allowedGenres = ["G", "PG"];

        if (age >= 13) {
            allowedGenres.push("PG-13", "R");
        }
        if (age >= 22) {
            allowedGenres.push("X");
        }

        res.json({ ...user, allowedGenres });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/payment/user/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const age = new User(user).calculateAge();
        let allowedGenres = ["G", "PG"];

        if (age >= 13) {
            allowedGenres.push("PG-13", "R");
        }
        if (age >= 22) {
            allowedGenres.push("X");
        }

        res.json({ ...user, allowedGenres });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//Route for Changing password
router.put("/change-password", async (req, res) => {
	try {
		const { email, password } = req.body;
		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ error: "User already exists with this email" });
		}
		const passwordMatch = await argon2.verify(
			existingUser.password,
			password.toLowerCase()
		);
		if (passwordMatch) {
			return res
				.status(401)
				.json({ error: "Password is the same as former password" });
		}
		// Hash the password using bcrypt
		const hashedPassword = await argon2.hash(password);
		existingUser.password = hashedPassword;
		return res.status(201).json({ message: "Password changed successfully" });
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

//edit a particular user
router.put("/edit/:id", authenticateMiddleware, async (req, res) => {
	try {
		const { id } = req.params;
		const { username, email, password, avatar, dob } = req.body;

		// Find the user by ID
		let user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Update user properties
		user.username = username || user.username;
		user.email = email || user.email;
		user.avatar = avatar || user.avatar;
		user.dob = dob || user.dob;

		if (password) {
			// Hash the new password using bcrypt
			const hashedPassword = await argon2.hash(password);
			user.password = hashedPassword;
		}

		// Save the updated user
		user = await user.save();

		res.status(200).json({ message: "User updated successfully", user });
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

//delete a particular user - only admin function
router.delete("/delete/:id",  async (req, res) => {
	try {
		const { id } = req.params;

		// Find the user by ID and delete
		const deletedUser = await User.findByIdAndDelete(id);
		if (!deletedUser) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

//Route for getting a particular user
router.get("/", async (req, res) => {
	try {
		// Extract user ID from request parameters
		const users = await User.find(); // Find user by ID

		res.json(users); // Return the user as JSON
	} catch (error) {
		console.error("Error fetching user by ID:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.put("/change-user-status", async (req, res) => {
	try {
		// Set all users' isActive status to true
		await User.updateMany({}, { status: true });

		return res
			.status(200)
			.json({ message: "User status changed successfully" });
	} catch (error) {
		console.error("Error changing user status:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

router.post("/change-user-status", async (req, res) => {
	try {
		// Update user's status
		const updatedUser = await User.findByIdAndUpdate(
			req.body.userId,
			{ status: req.body.status },
			{ new: true }
		);

		return res
			.status(200)
			.json({ message: "User status changed successfully", user: updatedUser });
	} catch (error) {
		console.error("Error changing user status:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});
// GET /api/subscription/status/:userId
router.get('/status/:userId', async (req, res) => {
  const userId = req.params.userId;  // Get userId from URL parameters

  try {
    const subscription = await Subscription.findOne({ userId });
    res.json({ isSubscribed: !!subscription, subscription });
  } catch (err) {
    console.error('Error fetching subscription status for user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Route to check user payment status
router.get('/payment-status/:userId', async (req, res) => {
	const { userId } = req.params;
  
	try {
	  const user = await User.findOne({ _id: userId });
  
	  if (!user) {
		return res.status(404).json({ hasPaid: false, message: 'User not found' });
	  }
  
	  res.json({ hasPaid: user.hasPaid });
	} catch (err) {
	  console.error('Error fetching user payment status:', err);
	  res.status(500).json({ message: 'Server error' });
	}
  });
router.post('/save-transaction', async (req, res) => {
	const { userId, username, email, orderId, payerId, amount, currency } = req.body;
  
	try {
	  const newTransaction = new Transaction({
		userId,
		username,
		email,
		orderId,
		payerId,
		amount,
		currency
	  });
  
	  await newTransaction.save();
  
	  await User.updateOne({ _id: userId }, { hasPaid: true },{ lastPaymentDate: new Date()});
  
	  res.status(201).send({ message: 'Transaction saved and user payment status updated successfully!' });
	} catch (error) {
	  console.error('Error saving transaction:', error);
	  res.status(500).send({ message: 'Failed to save transaction and update user payment status.' });
	}
  });
  
  
router.get("/transactions", async (req, res) => {
    try {
        const transactions = await Transaction.find(); // Retrieve all transactions
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Route to get transactions by userId
router.get("/transactions/:userId",  async (req, res) => {
    const userId = req.params.userId; // Extract userId from URL parameters

    try {
        const transactions = await Transaction.find({ userId }); // Retrieve transactions by userId
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions by userId:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// In your backend server (Node.js/Express)
router.post('/update-payment-status', async (req, res) => {
	const { userId, hasPaid } = req.body;
	try {
	  const user = await User.findById(userId);
	  user.hasPaid = hasPaid;
	  await user.save();
	  res.status(200).send({ message: 'Payment status updated successfully.' });
	} catch (error) {
	  res.status(500).send({ message: 'Failed to update payment status.', error });
	}
  });
  
 
  router.post('/orders', async (req, res) => {
	const { chatId, description, price, createdBy } = req.body;
	try {
	  const orderRef = db.ref(`chats/${chatId}/orders`).push();
	  await orderRef.set({
		description,
		price,
		createdBy,
		timestamp: admin.database.ServerValue.TIMESTAMP
	  });
	  res.status(200).send({ message: 'Order created successfully', orderId: orderRef.key });
	} catch (error) {
	  res.status(500).send({ error: 'Error creating order' });
	}
  });

module.exports = router;

