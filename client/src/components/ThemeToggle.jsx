import React from "react";
import { useTheme } from "../contexts/ThemeContexts";
import { Sun, Moon } from "lucide-react";
import "./css/ThemeToggle.css";

const ThemeToggle = ({ showText = false, className = "" }) => {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`theme-toggle ${darkMode ? "is-dark" : "is-light"} ${className}`}
            aria-label="Toggle color theme"
            type="button"
        >
            <div className="theme-toggle-track">
                <div className="theme-toggle-thumb">
                    {darkMode ? (
                        <Moon size={12} className="moon-icon" fill="currentColor" />
                    ) : (
                        <Sun size={12} className="sun-icon" fill="currentColor" />
                    )}
                </div>
            </div>
            {showText && (
                <span className="theme-toggle-text">
                    {darkMode ? "Light mode" : "Dark mode"}
                </span>
            )}
        </button>
    );
};

export default ThemeToggle;
