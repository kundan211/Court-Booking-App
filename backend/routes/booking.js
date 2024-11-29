const express = require('express');
const Booking = require('../models/Booking');
const Court = require('../models/Court');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Helper function to convert DD-MM-YYYY to a valid Date object
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`);  // Convert to YYYY-MM-DD format
};

// User booking route
router.post('/book', verifyToken, async (req, res) => {
  const { court_id, slot, date } = req.body;

  try {
    // Ensure court_id is provided
    if (!court_id) {
      return res.status(400).json({ message: 'Court ID is required' });
    }

    // Ensure date and slot are provided
    if (!date || !slot) {
      return res.status(400).json({ message: 'Date and Slot are required' });
    }

    // Convert date string (DD-MM-YYYY) to Date object
    const parsedDate = parseDate(date);

    // Find the court by its ID
    const court = await Court.findById(court_id);

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    // Check if the requested slot exists in the court's slots
    if (!court.slots.includes(slot)) {
      return res.status(400).json({ message: `Slot ${slot} is not available for this court` });
    }

    // Check if the slot is already booked on the given date
    const existingBooking = await Booking.findOne({ court_id, slot, date: parsedDate });
    console.log(existingBooking?.date!=parsedDate);
    
    if (existingBooking&&existingBooking?.date!==parsedDate) {
      return res.status(400).json({ message: 'This slot is already booked for the given date' });
    }

    // Proceed with the booking if slot is available
    const booking = new Booking({
      court_id,
      slot,
      date: parsedDate,  // Save the parsed Date object
      user_id: req.user._id,  // Assuming user is logged in and verified
    });

    await booking.save();
    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error('Booking error:', error);  // Log the error for debugging
    res.status(500).json({ error: 'Failed to book slot', details: error.message });
  }
});

// User booking route
router.get('/bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.user._id }).populate('court_id'); // Assuming court_id is a reference
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
});

module.exports = router;
