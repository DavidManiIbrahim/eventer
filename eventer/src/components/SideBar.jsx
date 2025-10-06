import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContexts";
import { getCurrentUser } from "../utils/auth";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

  // ✅ Theme-based style variables for dark/light mode
  const bgColor = theme === "dark" ? "#0f172a" : "#ffffff"; // sidebar background
  const textColor = theme === "dark" ? "#f9fafb" : "#1f2937"; // text color
  const hoverBg = theme === "dark" ? "#1e293b" : "#f3f4f6"; // hover effect
  const borderColor = theme === "dark" ? "#334155" : "#e5e7eb"; // sidebar border

  return (
    <aside
      className={`pt-12 fixed top-0 left-0 h-screen flex flex-col justify-between transition-all duration-300 shadow-lg ${
        theme === "dark" ? "dark-sidebar" : "light-sidebar"
      }`}
      style={{
        width: collapsed ? "5rem" : "16rem",
        backgroundColor: bgColor,
        color: textColor,
        borderRight: `1px solid ${borderColor}`,
      }}
    >
      {/* Collapse Button */}
      <div className="flex justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="transition-colors rounded-md px-2 py-1 text-sm"
          style={{
            backgroundColor: hoverBg,
            color: textColor,
            border: `1px solid ${borderColor}`,
          }}
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
            className={`group relative flex items-center gap-3 p-2 rounded-lg transition-all ${
              item.highlight ? "font-semibold" : ""
            }`}
            style={{
              backgroundColor: item.highlight ? "#6366f1" : "transparent",
              color: item.highlight ? "#fff" : textColor,
            }}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}

            {/* Tooltip when collapsed */}
            {collapsed && (
              <span
                className="absolute left-16 text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                style={{
                  backgroundColor: theme === "dark" ? "#1e293b" : "#111827",
                  color: "#fff",
                  pointerEvents: "none",
                }}
              >
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Theme Toggle (remains here only) */}
      <div
        className="px-2 py-4 border-t transition"
        style={{ borderColor: borderColor }}
      >
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all"
          style={{
            backgroundColor: hoverBg,
            color: textColor,
            border: `1px solid ${borderColor}`,
            cursor: "pointer",
          }}
        >
          <span className="text-lg">
            {theme === "dark" ? "☀️" : "🌙"}
          </span>
          {!collapsed && (
            <span className="font-medium">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
