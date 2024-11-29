const express = require('express');
const Booking = require('../models/Booking');
const Center = require('../models/Center');
const Sport = require('../models/Sport');
const Court = require('../models/Court');
const { verifyToken, isManager } = require('../middleware/authMiddleware');
const router = express.Router();

// Helper function to convert DD-MM-YYYY to a valid Date object
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`);  // Convert to YYYY-MM-DD format
};

router.get('/bookings/sport/:sport_id', verifyToken, isManager, async (req, res) => {
  let { sport_id } = req.params;

  try {
    // Trim the sport_id to remove any trailing spaces or newline characters
    sport_id = sport_id.trim();

    // Ensure sport_id is a valid ObjectId
    if (!sport_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid sport ID format' });
    }

    // Find all courts associated with the given sport
    const courts = await Court.find({ sport_id });

    if (courts.length === 0) {
      return res.status(404).json({ message: 'No courts found for this sport' });
    }

    // Get the court IDs to use in the Booking query
    const courtIds = courts.map(court => court._id);

    // Find all bookings for the courts
    const bookings = await Booking.find({ court_id: { $in: courtIds } });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this sport' });
    }

    res.json(bookings);
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({ error: 'Error retrieving bookings', details: error.message });
  }
});



// Create a new center (only managers can do this)
router.post('/center', verifyToken, async (req, res) => {
  const { name, location } = req.body;

  const center = new Center({ name, location });
  try {
    await center.save();
    res.status(201).json({ message: 'Center created successfully', center });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create center' });
  }
});

// Create a new sport for a center (only managers can do this)
router.post('/sport', verifyToken, isManager, async (req, res) => {
  const { name, center_id } = req.body;

  const sport = new Sport({ name, center_id });
  try {
    await sport.save();
    res.status(201).json({ message: 'Sport created successfully', sport });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sport' });
  }
});

// Create a new court for a sport (only managers can do this)
router.post('/court', verifyToken, isManager, async (req, res) => {
  const { name, sport_id, slots } = req.body;

  const court = new Court({ name, sport_id, slots });
  try {
    await court.save();
    res.status(201).json({ message: 'Court created successfully', court });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create court' });
  }
});

// Add or update slots for a specific court (only managers can do this)
router.put('/court/:courtId/slots', verifyToken, isManager, async (req, res) => {
  const { slots } = req.body;  // Expecting an array of slots
  const courtId = req.params.courtId;

  try {
    const court = await Court.findById(courtId);

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    // Update the court's slots
    court.slots = slots;  // Replace existing slots with new ones
    await court.save();

    res.status(200).json({ message: 'Slots updated successfully', court });
  } catch (error) {
    console.error('Error updating slots:', error); // Log the actual error
    res.status(500).json({ error: 'Failed to update slots' });
  }
});

// Get all centers
// router.get('/centers', verifyToken, async (req, res) => {
//   try {
//       const centers = await Center.find();
//       res.status(200).json({ centers });
//   } catch (error) {
//       console.error('Error retrieving centers:', error);
//       res.status(500).json({ error: 'Failed to retrieve centers' });
//   }
// });
// Temporarily comment out verifyToken
// router.get('/centers', verifyToken, isManager, async (req, res) => {
  router.get('/centers',verifyToken, async (req, res) => {
    try {
        const centers = await Center.find();
        res.status(200).json({ centers });
    } catch (error) {
        console.error('Error retrieving centers:', error);
        res.status(500).json({ error: 'Failed to retrieve centers' });
    }
});


// Get all sports for a specific center
// Assuming you're using a router
router.get('/centers/:centerId/sports', verifyToken,  async (req, res) => {
  const { centerId } = req.params;

  try {
    const sports = await Sport.find({ center_id: centerId });

    if (sports.length === 0) {
      return res.status(404).json({ message: 'No sports found for this center' });
    }

    res.status(200).json({ sports });
  } catch (error) {
    console.error('Error retrieving sports:', error);
    res.status(500).json({ error: 'Failed to retrieve sports' });
  }
});


// Get all courts for a specific sport
router.get('/sports/:sportId/courts', verifyToken,  async (req, res) => {
  const { sportId } = req.params;

  try {
    const courts = await Court.find({ sport_id: sportId });

    if (courts.length === 0) {
      return res.status(404).json({ message: 'No courts found for this sport' });
    }

    // Fetch the available slots for each court
    const courtDetails = await Promise.all(
      courts.map(async (court) => {
        const bookings = await Booking.find({ court_id: court._id });
        const bookedSlots = bookings.map(booking => booking.slot); // Extract booked slots

        return {
          id: court._id,
          name: court.name,
          slots: court.slots.map(slot => ({
            slot,
            available: !bookedSlots.includes(slot) // Check if slot is available
          }))
        };
      })
    );

    res.status(200).json({ courts: courtDetails });
  } catch (error) {
    console.error('Error retrieving courts:', error);
    res.status(500).json({ error: 'Failed to retrieve courts' });
  }
});

module.exports = router;
