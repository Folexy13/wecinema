const express = require("express");
require("dotenv").config();
const { VideoController, UserController } = require("./controller");
const connectDB = require("./config");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

app.use(morgan("dev"));
app.use(express.json());

const allowedOrigins = [
    "http://www.wecinema.co",
    "https://www.wecinema.co",
    "http://wecinema.co",
    "https://wecinema.co",
    "http://localhost:3000",
    "https://wecinema-admin.onrender.com",
    "https://wecinema.onrender.com",
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

// Example in Express.js
app.use((req, res, next) => {
    res.cookie('token', 'your-token-value', {
        httpOnly: true,
        secure: true,
        sameSite: 'None', // Required for cross-domain cookies
    });
    next();
});

// Add logging middleware to debug incoming requests
app.use((req, res, next) => {
    console.log("Received request: ", req.method, req.url);
    console.log("Request body: ", req.body);
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
