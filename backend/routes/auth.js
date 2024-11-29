const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register new user
router.post('/signup', async (req, res) => {
  const { name, email, password, role = "user" } = req.body; // Default role is 'user'

  try {
    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const user = new User({ name, email, password: hashedPassword, role });

    // Save the user to the database
    await user.save();

    // Create a JWT token with the user's ID and role
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload includes user ID and role
      process.env.JWT_SECRET, // Secret key
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Return the token, name, email, and role of the registered user
    res.status(201).json({
      message: 'User registered successfully',
      token, // Include the JWT token in the response
      user: { name, email, role } // Return the user data with role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Return user information (name, email) and token
    res.json({ 
      message: "Login successful",
      token, 
      user: { name: user.name, email: user.email, role: user.role } 
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});


router.post('/logout', (req, res) => {
    // On logout, simply inform the client to clear the token
    res.status(200).json({ message: 'Logout successful, please clear the token on the client side.' });
  });
module.exports = router;
