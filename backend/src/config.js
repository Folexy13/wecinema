const mongoose = require("mongoose");

/**
 * Connect to a MongoDB database using Mongoose.
 * @param {string} databaseURL - The URL of the MongoDB database to connect to.
 * @returns {Promise<mongoose.Mongoose>} A promise that resolves with the Mongoose instance upon successful connection.
 */
async function connectToMongoDB(databaseURL) {
	// Define Mongoose connection options.
	const options = {
		dbName: "wecinemaDB_test",
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// Additional options can be added here if needed.
	};

	try {
		// Attempt to connect to the MongoDB database.
		const mongooseInstance = await mongoose.connect(databaseURL, options);
		console.log("DB CONNECTION SUCCESSFUL!");
		console.log("M", databaseURL);
		return mongooseInstance;
	} catch (error) {
		// Handle connection errors.
		console.error(
			`An error occurred while connecting to the database: ${error}`
		);
		throw error;
	}
}

module.exports = connectToMongoDB;
