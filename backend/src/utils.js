const jwt = require("jsonwebtoken");

const authenticateMiddleware = (req, res, next) => {
	// Get the token from the request headers
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({ error: "Unauthorized: No token provided" });
	}

	// Verify the token
	jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
		if (err) {
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

module.exports = { authenticateMiddleware };
