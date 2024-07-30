// app.js

const express = require("express");
require("dotenv").config();
const { VideoController, UserController } = require("./controller");
const connectDB = require("./config");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const https = require('https');
const socketIo = require('socket.io')
const server = https.createServer(app);
const io = socketIo(server);
app.use(morgan("dev"));
app.use(express.json());
const allowedOrigins = [
	"http://www.wecinema.co",
	"https://www.wecinema.co",
	"http://wecinema.co",
	"https://wecinema.co",
	"https://wecinema.onrender.com",
	"https://wecinema-admin.onrender.com",
	"https://wecinema.co/hypemode",
	"https://wecinema.co/videoeditor",
	"https://wecinema.onrender.com/user/login"

];
app.use(cors()); // Enable CORS for all routes

const corsOptions = {
	origin: function (origin, callback) {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};

  
app.use(cors(corsOptions));
// Define a route to create a user
app.use("/video", VideoController);
app.use("/user", UserController);
app.use(bodyParser.json());

// Connect to the database
connectDB(process.env.DB_URI);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
