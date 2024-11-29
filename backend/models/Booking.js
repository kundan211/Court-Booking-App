const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  court_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slot: { type: String, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Booking', bookingSchema);
