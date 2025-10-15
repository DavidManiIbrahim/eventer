import React, { useContext, useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { useSocket } from "../hooks/useSocket";
import { Bell } from "lucide-react";
import { ThemeContext } from "../contexts/ThemeContexts"; // still used for theme detection


const NotificationBell = ({ userId }) => {
  const { notifications, setNotifications, loading, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
    const { darkMode } = useContext(ThemeContext); // only read mode, no toggle
  

  // Listen for live notifications
  useSocket(userId, (data) => {
    setNotifications((prev) => [
      { ...data, _id: Date.now(), read: false },
      ...prev,
    ]);
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        className="relative flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="p-3 border-b dark:border-gray-700 flex justify-between">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Notifications
            </h3>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <p className="text-gray-500 text-sm p-3">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-gray-500 text-sm p-3">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`px-3 py-2 text-sm cursor-pointer ${
                    n.read
                      ? "text-gray-500 bg-transparent"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  } hover:bg-gray-200 dark:hover:bg-gray-600`}
                >
                  <p>{n.message}</p>
                  <span className="text-xs text-gray-400">
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
