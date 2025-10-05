import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../utils/auth";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [collapsed, setCollapsed] = useState(false);

  // ✅ Load user + preferences on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) setUser(currentUser);

    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsed !== null) setCollapsed(savedCollapsed === "true");
  }, []);

  // ✅ Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // ✅ Save collapse preference
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  if (!user) return null;

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: "🎛" },
    { to: "/events", label: "Events", icon: "🎫" },
    { to: "/admin/dashboard", label: "Stats", icon: "📊" },
    { to: "/my-tickets", label: "My Tickets", icon: "🎟" },
    { to: "/live/events", label: "Live", icon: "⭕" },
    { to: "/create", label: "Create", icon: "➕", highlight: true },
    { to: "/settings", label: "Settings", icon: "⚙" },
  ];

  return (
    <aside
      className={`pt-12 fixed top-0 left-0 h-screen ${
        collapsed ? "w-20" : "w-64"
      } border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col justify-between transition-all duration-300`}
    >
      {/* Collapse Button */}
      <div className="flex justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {collapsed ? "➡" : "⬅"}
        </button>
      </div>

      {/* Sidebar Links */}
      <div className="px-2 py-4 space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`group relative flex items-center gap-3 p-2 rounded-lg transition ${
              item.highlight
                ? "bg-indigo-500 text-white hover:bg-indigo-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}

            {/* Tooltip when collapsed */}
            {collapsed && (
              <span className="absolute left-16 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Dark/Light Mode Toggle */}
      <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <span className="text-lg">{darkMode ? "🌞" : "🌙"}</span>
          {!collapsed && (
            <span className="font-medium">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
