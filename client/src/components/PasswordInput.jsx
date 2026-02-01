import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./css/PasswordInput.css";

const PasswordInput = ({ name, value, onChange, placeholder, className, required = false }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="password-input-wrapper">
            <input
                type={showPassword ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`form-input password-input ${className || ""}`}
                required={required}
            />
            <button
                type="button"
                className="password-toggle-btn"
                onClick={toggleVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? (
                    <EyeOff size={20} className="password-toggle-icon" />
                ) : (
                    <Eye size={20} className="password-toggle-icon" />
                )}
            </button>
        </div>
    );
};

export default PasswordInput;
