import React, { useContext, useState, useEffect, useRef } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { useSocket } from "../hooks/useSocket";
import { Bell } from "lucide-react";
import { ThemeContext } from "../contexts/ThemeContexts";

const NotificationBell = ({ userId }) => {
  const { notifications, setNotifications, loading, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const dropdownRef = useRef(null);

  // Listen for real-time notifications
  useSocket(userId, (data) => {
    setNotifications((prev) => [
      { ...data, _id: Date.now(), read: false },
      ...prev,
    ]);
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ===== Notification Button ===== */}
      <button
        className={`relative flex items-center p-2 rounded-full transition-colors ${
          darkMode
            ? "hover:bg-gray-700 text-gray-200"
            : "hover:bg-gray-100 text-gray-700"
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* ===== Dropdown Panel ===== */}
      {open && (
        <div
          className={`absolute right-0 mt-2 w-72 shadow-lg rounded-xl border transition-colors ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          {/* Header */}
          <div
            className={`p-3 border-b text-sm font-semibold ${
              darkMode ? "border-gray-700 text-gray-200" : "border-gray-100 text-gray-700"
            }`}
          >
            Notifications
          </div>

          {/* Notifications List */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <p
                className={`text-sm p-3 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Loading...
              </p>
            ) : notifications.length === 0 ? (
              <p
                className={`text-sm p-3 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                    n.read
                      ? darkMode
                        ? "text-gray-400 hover:bg-gray-700"
                        : "text-gray-500 hover:bg-gray-100"
                      : darkMode
                      ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <p>{n.message}</p>
                  <span
                    className={`block text-xs mt-1 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
