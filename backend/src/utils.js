const jwt = require("jsonwebtoken");
const Mongoose = require("mongoose");

const authenticateMiddleware = (req, res, next) => {
	// Get the token from the request headers
	let token = req.headers.authorization;
	token = token?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Unauthorized: No token provided" });
	}

	// Verify the token
	jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
		if (err) {
			console.log(err);
			return res.status(401).json({ error: "Unauthorized: Invalid token" });
		}

		// Check if the token has expired
		const currentTimestamp = Math.floor(Date.now() / 1000);
		if (decoded.exp < currentTimestamp) {
			return res.status(401).json({ error: "Unauthorized: Token has expired" });
		}

		// Attach the user information to the request object for further use
		req.user = decoded;

		// Continue to the next middleware or route handler
		next();
	});
};

const isAdmin = (req, res, next) => {
	// Check if the user is authenticated
	if (!req.user) {
		return res
			.status(401)
			.json({ error: "Unauthorized: User not authenticated" });
	}

	// Check if the user is an admin
	if (req.user.role !== "admin") {
		return res
			.status(403)
			.json({ error: "Unauthorized: Admin access required" });
	}

	// User is an admin, allow the request to proceed
	next();
};
function isValidObjectId(id) {
	if (!id) {
		return false; // If id is null or undefined, it's not a valid ObjectId
	}

	// Attempt to create a new ObjectId with the provided string
	try {
		const objectId = new Mongoose.Types.ObjectId(id);
		return String(objectId) === id; // Compare the string representation to check validity
	} catch (error) {
		console.log(error);

		return false; // If an error occurs during ObjectId creation, it's not a valid ObjectId
	}
}

module.exports = { authenticateMiddleware, isValidObjectId, isAdmin };
