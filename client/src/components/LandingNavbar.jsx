import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContexts";
import ThemeToggle from "../components/ThemeToggle";
import { Menu, X, TicketCheck, ToggleLeft, ToggleRight } from "lucide-react";
import useInstallPrompt from "../hooks/useInstallPrompt";
import "./css/LandingNavbar.css";

export default function LandingNavbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const { canInstall, install } = useInstallPrompt();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="landing-header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <TicketCheck size={24} className="logo-icon" />
                    <h1>TickiSpot</h1>
                </Link>

                <div className="mobile-controls">
                    {/* <button
                        onClick={toggleTheme}
                        className="theme-toggle-btn mobile-only"
                        aria-label="Toggle theme"
                    >
                        {darkMode ? (
                            <ToggleLeft size={18} className="toggle-icon" />
                        ) : (
                            <ToggleRight size={18} className="toggle-icon" />
                        )}
                    </button>
                    <button 
                        className="menu-toggle-btn mobile-only"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button> */}
                </div>

                <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
                    <Link to="/events" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        Events
                    </Link>
                    <Link to="/pricing" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        Pricing
                    </Link>
                    <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        About
                    </Link>
                    <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        Contact
                    </Link>
                    
                    {canInstall && (
                        <button
                            onClick={install}
                            className="btn btn-primary install-btn"
                        >
                            Install App
                        </button>
                    )}

                    {isLoggedIn ? (
                        <Link to="/dashboard" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                            Dashboard
                        </Link>
                    ) : (
                        <div className="log">
                            <Link to="/login" className="btn btn-text" onClick={() => setIsMenuOpen(false)}>
                                Sign In
                            </Link>
                            <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                                Get Started
                            </Link>
                        </div>
                    )}
                                <ThemeToggle />
                    
                    {/* <button
                        onClick={toggleTheme}
                        className="theme-toggle-btn desktop-only"
                        aria-label="Toggle theme"
                    >
                        {darkMode ? (
                            <ToggleLeft size={18} className="toggle-icon" />
                        ) : (
                            <ToggleRight size={18} className="toggle-icon" />
                        )}
                    </button> */}
                </nav>
            </div>
        </header>
    );
}
