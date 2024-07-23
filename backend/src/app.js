// app.js

const express = require("express");
require("dotenv").config();
const { VideoController, UserController } = require("./controller");
const connectDB = require("./config");
const morgan = require("morgan");
const Stripe = require('stripe');
const stripe = Stripe('349039409409409430'); // Replace with your actual secret key
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const http = require('http');
const socketIo = require('socket.io')
const server = http.createServer(app);
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
app.post('/api/subscribe', async (req, res) => {
	const { email, paymentMethodId, planId } = req.body;
  
	try {
	  // Create a new customer or use an existing one in your database
	  const customer = await stripe.customers.create({
		email: email,
		payment_method: paymentMethodId,
		invoice_settings: {
		  default_payment_method: paymentMethodId,
		},
	  });
  
	  // Create the subscription
	  const subscription = await stripe.subscriptions.create({
		customer: customer.id,
		items: [{ plan: planId }],
		expand: ['latest_invoice.payment_intent'],
	  });
  
	  res.json(subscription);
	} catch (error) {
	  console.error('Subscription failed:', error);
	  res.status(400).json({ error: error.message });
	}
  });
  app.post('/user/subscription/initiate', async (req, res) => {
	const { userId, plan } = req.body;
  
	try {
	  // For Stripe, create a checkout session
	  const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: [{
		  price: plan === 'User Subscription' ? 'price_id_for_user' : 'price_id_for_studio',  // Define price IDs in your Stripe dashboard
		  quantity: 1,
		}],
		mode: 'subscription',
		success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${req.headers.origin}/cancel`,
	  });
  
	  res.json({ paymentRedirectUrl: session.url });
	} catch (error) {
	  console.error('Failed to create checkout session:', error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });
  app.get('/success', async (req, res) => {
    const sessionId = req.query.session_id;
    // Retrieve the session to confirm the payment was successful
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const customerId = session.customer;

        // Assuming you have a method to activate the subscription in your database
        const subscriptionActivated = await activateSubscription(customerId);

        if (subscriptionActivated) {
            // Redirect to a page or render a message confirming the subscription
            res.redirect('/dashboard'); // Redirect to the user dashboard or a confirmation page
        } else {
            res.status(500).render('error', { error: 'Failed to activate subscription.' });
        }
    } catch (error) {
        console.error('Error confirming payment or activating subscription:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
});
app.get('/cancel', (req, res) => {
    // Render a view or redirect to a page informing the user about the cancellation
    res.render('cancel', { message: 'Payment cancelled. If you encountered an issue, please contact support.' });
});

  // Endpoint to receive the Google ID token from frontend
app.post('/user/api/auth/google', async (req, res) => {
	const { token } = req.body;
	try {
	  const ticket = await client.verifyIdToken({
		  idToken: token,
		  audience: '854144808645-smoijpcud2qe3ur0nkavnnmakr8su9ui.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app
	  });
	  const payload = ticket.getPayload();

    // Check or create a user in your database
    const userId = payload['sub'];  // Google's user ID
    // Here you might want to create or update the user in your database
    
    // After saving the user, you might want to initiate a subscription
    res.json({ userId: userId, message: 'User verified and logged in successfully' });
  } catch (error) {
    res.status(401).json({ error: 'Failed to verify user' });
  }
});
io.on('connection', socket => {
	console.log('User connected');
	
	socket.on('sendMessage', ({ senderId, receiverId, content }) => {
	  // Save message to database (if needed)
	  io.emit(`receiveMessage_${receiverId}`, { senderId, content });
	});
  
	socket.on('disconnect', () => {
	  console.log('User disconnected');
	});
  });
 
// Connect to the database
connectDB(process.env.DB_URI);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
