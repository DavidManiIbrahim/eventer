const Event = require("../models/Event");
const Ticket = require("../models/Ticket");

// ✅ Create new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      pricing,
      totalTickets,
      eventType,
      streamType,
      streamURL,
    } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    const newEvent = new Event({
      title,
      description,
      category,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      image: imagePath,
      pricing: pricing ? JSON.parse(pricing) : [],
      totalTickets,
      eventType,
      liveStream: {
        isLive: false,
        streamType,
        streamURL,
      },
      createdBy: req.user.id,
    });

    await newEvent.save();
    res.status(201).json({ message: "✅ Event created successfully", event: newEvent });
  } catch (err) {
    console.error("❌ Event creation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get all events (Public)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "username email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get events created by logged-in user
exports.getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const myEvents = await Event.find({ createdBy: userId })
      .populate("createdBy", "username email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(myEvents);
  } catch (error) {
    console.error("❌ Error fetching user events:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get buyers for a specific event
exports.getEventBuyers = async (req, res) => {
  try {
    const { eventId } = req.params;
    const tickets = await Ticket.find({ event: eventId })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Toggle livestream status
exports.toggleLiveStream = async (req, res) => {
  const { eventId, isLive } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    event.liveStream.isLive = isLive;
    await event.save();

    res.status(200).json({
      message: `Stream is now ${isLive ? "LIVE" : "OFF"}`,
      event,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update event
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    Object.assign(event, updates);
    await event.save();

    res.status(200).json({ message: "✅ Event updated", event });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: "🗑️ Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
