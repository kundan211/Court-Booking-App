const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const managerRoutes = require('./routes/manager');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(bodyParser.json());
const corsOptions = {
  origin: '*', // Allow only frontend on localhost:3000
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies or other credentials to be sent
};
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/manager', managerRoutes);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
