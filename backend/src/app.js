// app.js

const express = require("express");
require("dotenv").config()
const { VideoController, UserController } = require("./controller");
const connectDB = require("./config");
const morgan = require("morgan");
const cors = require("cors");
const app = express();




app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: true }));

// Define a route to create a user
app.use("/video", VideoController);
app.use("/user", UserController);


// Connect to the database
connectDB(process.env.DB_URI);;

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
