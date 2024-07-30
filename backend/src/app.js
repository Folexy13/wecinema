// app.js

const express = require("express");
require("dotenv").config();
const { VideoController, UserController } = require("./controller");
const connectDB = require("./config");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
const allowedOrigins = [
	"http://www.wecinema.co",
	"https://www.wecinema.co",
	"http://wecinema.co",
	"https://wecinema.co",
	"http://localhost:3000",
	"https://wecinema.onrender.com",
	"http://wecinema.onrender.com",
	"http://www.wecinema.onrender.com",
	"https://www.wecinema.onrender.com",
	"https://wecinema-admin.onrender.com",
];

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

// Connect to the database
connectDB(process.env.DB_URI);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
