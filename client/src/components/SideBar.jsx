import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContexts";
import { getCurrentUser } from "../utils/auth";
import "./css/sidebar.css"; 
import {
  LayoutDashboard,
  Home,
  BarChart3,
  Ticket,
  Radio,
  PlusCircle,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation(); // 👈 Get current route path

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) setUser(currentUser);

    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsed !== null) {
      setCollapsed(savedCollapsed === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  if (!user) return null;

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { to: "/events", label: "Home", icon: <Home /> },
    { to: "/admin/dashboard", label: "Stats", icon: <BarChart3 /> },
    { to: "/my-tickets", label: "My Tickets", icon: <Ticket /> },
    { to: "/live/events", label: "Live", icon: <Radio /> },
    { to: "/create", label: "Create", icon: <PlusCircle />, highlight: true },
    { to: "/settings", label: "Settings", icon: <Settings /> },
  ];

  return (
    <aside
      className={`sidebar fixed top-0 left-0 h-screen flex flex-col justify-between transition-all duration-300 pt-12 ${
        collapsed ? "collapsed" : ""
      } ${darkMode ? "dark-mode" : ""}`}
    >
      {/* Collapse Button */}
      <div className="flex justify-end p-2 pt-4">
        <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn">
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar Links */}
      <div className="px-2 py-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to; // 👈 Check if current route matches

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`menu-item group relative flex items-center gap-3 p-2 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 shadow"
                  : "bg-blue-600 hover:bg-blue-200 dark:hover:bg-blue-700"
              } ${item.highlight ? "highlight" : ""}`}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span className="tooltip absolute left-16 text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Theme Toggle */}
      <div className="px-2 py-4 border-t dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className="theme-toggle w-full flex justify-around align-middle"
        >
          <span className="text-lg">
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon />
            )}
          </span>
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
