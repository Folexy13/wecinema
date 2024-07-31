// app.js

const express = require("express");
require("dotenv").config();
const { VideoController, UserController } = require("./controller");
const connectDB = require("./config");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "https://wecinema.co/hypemode");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
  });
  
app.use(morgan("dev"));
app.use(express.json());

const corsOptions = {
	origin: 'https://wecinema.co/hypemode',
	methods: 'GET,POST,PUT,DELETE',
	allowedHeaders: 'Content-Type,Authorization',
	credentials: true,
  };
  
app.use(cors(corsOptions));
// Example in Express.js
app.use((req, res, next) => {
	res.cookie('token', 'your-token-value', {
	  httpOnly: true,
	  secure: true,
	  sameSite: 'None', // Required for cross-domain cookies
	});
	next();
  });
  
// Define a route to create a user
app.use("/video", VideoController);
app.use("/user", UserController);

// Connect to the database
connectDB(process.env.DB_URI);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
