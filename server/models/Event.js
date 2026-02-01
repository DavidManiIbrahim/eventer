const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,

  startDate: Date,
  startTime: String,
  endDate: Date,
  endTime: String,

  location: String,
  image: String,

  pricing: [
    {
      type: { type: String, required: true },
      price: { type: Number, default: 0 },
    },
  ],

  totalTickets: Number,
  ticketsSold: {
    type: Number,
    default: 0,
  },

  eventType: {
    type: String,
    enum: ["In-person", "Virtual", "Hybrid"],
    default: "In-person",
  },

  liveStream: {
    isLive: { type: Boolean, default: false },
    streamType: { type: String, enum: ["YouTube", "Facebook", "Custom", "Camera"] },
    streamURL: String,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
