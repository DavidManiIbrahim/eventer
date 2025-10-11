const express = require("express");

const {
  getSettings,
  updatePrivacy,
  updateNotifications,
  deleteAccount,
} = require ("../controllers/settingsController.js");
const { authMiddleware } = require ("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/:id", authMiddleware, getSettings);
router.put("/:id/privacy", authMiddleware, updatePrivacy);
router.put("/notifications/:id", authMiddleware, updateNotifications);
router.delete("/:id", authMiddleware, deleteAccount);

module.exports = router;
