import React from "react";
import "./css/ToggleSwitch.css";

const ToggleSwitch = ({ checked, onChange, label, id }) => {
    return (
        <div className="toggle-switch-container">
            <label className="toggle-switch">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    id={id}
                />
                <span className="toggle-switch-slider"></span>
            </label>
            {label && <span className="toggle-switch-label">{label}</span>}
        </div>
    );
};

export default ToggleSwitch;
