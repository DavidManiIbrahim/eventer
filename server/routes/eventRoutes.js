const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createEvent,
  getAllEvents,
  getEventById,
  getMyEvents,
  getEventBuyers,
  toggleLiveStream,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// ✅ Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/event_image"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ ROUTES

// Create new event
router.post("/create", authMiddleware, upload.single("image"), createEvent);

// Public route - fetch all events
router.get("/", getAllEvents);

// Get single event
router.get("/:id", getEventById);

// Authenticated routes
router.get("/my-events", authMiddleware, getMyEvents);
router.get("/buyers/:eventId", authMiddleware, getEventBuyers);
router.patch("/toggle-live", authMiddleware, toggleLiveStream);
router.put("/update/:eventId", authMiddleware, updateEvent);
router.delete("/delete/:eventId", authMiddleware, deleteEvent);

module.exports = router;
