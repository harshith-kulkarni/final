const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

// Initialize the app
const app = express();
const router = express.Router();

// Use middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Google OAuth2 Client setup
const CLIENT_ID = '1045359472979-qd5u7rvgtjffpf73fp5m9hklcdu735fo.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB URI
const mongoURI = 'mongodb+srv://harisonu151:zZYoHOEqz8eiI3qP@salaar.st5tm.mongodb.net/halsvar';

// Connect to MongoDB with extended timeout
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// User model
const User = require('./models/User');

// Add index for the username field to improve performance
User.schema.index({ username: 1 });

// Set up multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to render the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to the database
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password, recaptchaToken } = req.body;

    try {
        // Verify reCAPTCHA token
        const secretKey = '6LdfH3wqAAAAAF5AhVOPpNv8BRcXYYwB34oyvmz_';
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`);

        // Check if reCAPTCHA verification was successful
        if (!response.data.success) {
            return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
        }

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ success: false, message: 'User not found' });

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        // Create JWT token
        const token = jwt.sign({ id: user._id }, 'myVeryStrongAndRandomSecretKey123!', { expiresIn: '1h' });
        res.cookie('authToken', token, { httpOnly: true, secure: false, maxAge: 3600000 });
        res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Google login route
app.post('/google-login', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ success: false, message: 'ID token is missing' });
    }

    try {
        // Verify the token with Google OAuth2 client
        const ticket = await client.verifyIdToken({
            idToken,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const username = payload.name || payload.email.split('@')[0]; // Use Google name or email prefix
        const email = payload.email;

        // Check if user exists in the database
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                username,
                email,
            });
            await user.save(); // Save user without a password
        }

        // Create JWT token for the user
        const token = jwt.sign(
            { id: user._id },
            'myVeryStrongAndRandomSecretKey123!', // Directly hardcoded secret
            { expiresIn: '1h' }
        );

        // Set token in a secure cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure in production
            maxAge: 3600000, // 1 hour
            sameSite: 'strict', // Prevent CSRF
        });

        // Respond with success and user info
        res.json({
            success: true,
            message: 'Login successful',
            username: user.username,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error("Error verifying ID token:", error.message);
        res.status(400).json({ success: false, message: 'Invalid ID token' });
    }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Extract token
  console.log('Token received:', token);  // Log token for debugging

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized access' });
  }

  jwt.verify(token, 'myVeryStrongAndRandomSecretKey123!', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Session expired' });
    }
    req.user = user;
    next();
  });
};

// Example protected route
app.get('/protected-route', authenticateToken, (req, res) => {
    res.json({ success: true, message: 'You have access to this route', user: req.user });
});
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email not found.' });
        }

        res.status(200).json({ success: true, message: 'Email verified. Proceed to reset password.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while verifying the email.' });
    }
});

// Reset Password
app.patch('/reset-password', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email not found.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while resetting the password.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
