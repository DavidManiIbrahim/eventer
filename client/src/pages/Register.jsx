import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContexts";
import { ArrowRight } from "lucide-react";
import PasswordInput from "../components/PasswordInput";
import "./CSS/forms.css";
import { isAuthenticated } from "../utils/auth";
import icon from "../assets/icon.svg"


export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    isOrganizer: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", form.username.trim());
      formData.append("email", form.email.trim());
      formData.append("password", form.password);
      formData.append("isOrganizer", form.isOrganizer ? "true" : "false");

      await API.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Registered successfully ✅ Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`form-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="form-grid-background"></div>
      <div className="form-container">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "inherit", marginBottom: "1rem" }}>
            <img src={icon} className="tickispot-icon" />
          </Link>
          <h1 className="form-title">Create Account</h1>
          <p className="form-subtitle">Join TickiSpot and start creating amazing events</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="form-alert form-alert-error">
              {error}
            </div>
          )}
          {success && (
            <div className="form-alert form-alert-success">
              {success}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              name="username"
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <PasswordInput
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-checkbox-wrapper">
            <input
              type="checkbox"
              name="isOrganizer"
              checked={form.isOrganizer}
              onChange={handleChange}
              className="form-checkbox"
              id="isOrganizer"
            />
            <label htmlFor="isOrganizer" className="form-checkbox-label">
              I'm an Event Organizer
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="form-btn"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
          >
            {loading ? "Creating Account..." : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="form-footer">
          Already have an account?{" "}
          <Link to="/login" className="form-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
