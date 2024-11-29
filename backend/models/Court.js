const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourtSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sport_id: {
    type: Schema.Types.ObjectId,
    ref: 'Sport',
    required: true,
  },
  // Add predefined slots that the manager can add/modify
  slots: [
    {
      type: String,  // You can modify this type (e.g., time ranges, slot names)
      required: true,
    },
  ],
});

module.exports = mongoose.model('Court', CourtSchema);
