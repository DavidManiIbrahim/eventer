import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContexts";
import { getCurrentUser } from "../utils/auth";
import "./css/sidebar.css"; // ✅ Import sidebar CSS file

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) setUser(currentUser);

    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsed !== null) setCollapsed(savedCollapsed === "true");
  }, []);

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
      className={`sidebar fixed top-0 left-0 h-screen flex flex-col justify-between transition-all duration-300 pt-12 ${
        collapsed ? "collapsed" : ""
      } ${darkMode ? "dark-mode" : ""}`}
    >
      {/* Collapse Button */}
      <div className="flex justify-end p-2">
        <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn">
          {collapsed ? "➡" : "⬅"}
        </button>
      </div>

      {/* Sidebar Links */}
      <div className="px-2 py-4 space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`menu-item group relative flex items-center gap-3 p-2 rounded-lg ${
              item.highlight ? "highlight" : ""
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}

            {/* Tooltip when collapsed */}
            {collapsed && (
              <span className="tooltip absolute left-16 text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="px-2 py-4 border-t">
        <button onClick={toggleTheme} className="theme-toggle w-full">
          <span className="text-lg">{darkMode ? "☀️" : "🌙"}</span>
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
