const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getMyNotifications,
  markAsRead,
  createNotification,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// 🔒 All routes require authentication
router.post("/", authMiddleware, createNotification);
router.get("/my", authMiddleware, getMyNotifications);
router.put("/:id/read", authMiddleware, markAsRead);
router.put("/mark-all", authMiddleware, markAllAsRead);
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
