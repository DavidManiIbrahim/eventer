import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { logout, getCurrentUser } from "../utils/auth";
import { ThemeContext } from "../contexts/ThemeContexts"; // still used for theme detection
import "./css/NavBar.css";
import NotificationBell from "./NotificationBell";
import { ClosedCaption } from "lucide-react";


const PORT_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000";


export default function NavBar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext); // only read mode, no toggle

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) setUser(currentUser);

    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLogout", handleStorageChange);
    window.addEventListener("userLogin", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogout", handleStorageChange);
      window.removeEventListener("userLogin", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) logout();
  };

  return (
    <nav className="navbar fixed w-full z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="logo text-2xl font-bold tracking-wide">
          🎫 TickiSpot
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <span className="text-sm">
                Welcome, <strong>{user.username}</strong>
              </span>

              {/* Notification */}
              <div className="relative">
                <NotificationBell />
              </div>

              {/* User Profile Dropdown */}
              <div className="relative group">
                <img
                  src={`${PORT_URL}/uploads/profile_pic/${user.profilePic}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 cursor-pointer"
                />

                {/* Dropdown */}
                <div className="dropdown absolute right-0 mt-2 w-48 shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition duration-200">
                  <Link to={`/profile/${user.id}`} className="dropdown-item">
                    👤 Profile
                  </Link>
                  <Link to="/dashboard" className="dropdown-item">
                    📋 Dashboard
                  </Link>
                  <Link to="/admin/dashboard" className="dropdown-item">
                    📊 Stats
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary">
                🔐 Login
              </Link>
              <Link to="/register" className="btn-outline">
                📝 Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>
      </div>

     {/* Mobile Menu Overlay */}
{isMenuOpen && (
  <div
    className="mobile-nav-overlay show"
    onClick={() => setIsMenuOpen(false)}
  ></div>
)}

{/* Mobile Nav Modal */}
<div className={`mobile-nav md:hidden ${isMenuOpen ? "show" : ""}`}>
  
  {user ? (
    <>
      <p className=" flex justify-between text-sm">
        <span>Welcome, <strong>{user.username}</strong></span>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none  hover:text-red-500"
        >
          {isMenuOpen ? <ClosedCaption/> : "☰"}
        </button>
      </p>
      <Link to="/events" className="nav-link" onClick={() => setIsMenuOpen(false)}>
        🎫 Events
      </Link>
      <Link to={`/profile/${user.id}`} className="nav-link" onClick={() => setIsMenuOpen(false)}>
        👤 Profile
      </Link>
      <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
        📋 Dashboard
      </Link>
      <Link to="/admin/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
        📊 Stats
      </Link>
      <button onClick={handleLogout} className="logout">
        🚪 Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
        🔐 Login
      </Link>
      <Link to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>
        📝 Register
      </Link>
    </>
  )}
</div>

    </nav>
  );
}
