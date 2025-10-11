const User = require("../models/User.js");

// ✅ Get user settings
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update privacy settings
const updatePrivacy = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { privacy: req.body },
      { new: true }
    ).select("-password");
    res.json({ message: "Privacy updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating privacy settings" });
  }
};

// ✅ Update notification settings
const updateNotifications = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { notifications: req.body },
      { new: true }
    ).select("-password");
    res.json({ message: "Notifications updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating notifications" });
  }
};

// ✅ Delete account
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting account" });
  }
};

module.exports = {
  getSettings,
  updatePrivacy,
  updateNotifications,
  deleteAccount,
};
