import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { ThemeContext } from "../contexts/ThemeContexts";
import "./css/Settings.css";
import SettingsModal from "./EditProfileModal";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ useParams to capture the user ID from the route
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Use the backend’s /api/users/:id route
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data.user || res.data;
        setUser(userData);

        console.log("Fetched user:", userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "privacy", label: "Privacy" },
    { id: "notifications", label: "Notifications" },
    { id: "billing", label: "Billing" },
    { id: "apps", label: "Connected Apps" },
    { id: "danger", label: "Danger Zone" },
  ];

  return (
    <div
      className="min-h-screen flex ml-64 pt-16 settings-container"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Sidebar */}
      <aside
        className="w-64 border-r hidden md:block sidebar"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <h2
          className="text-xl font-semibold px-6 py-4 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          ⚙️ Settings
        </h2>
        <nav className="mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="w-full text-left px-6 py-3 text-sm font-medium transition"
              style={{
                backgroundColor:
                  activeTab === tab.id ? "var(--active-bg)" : "transparent",
                color: "var(--text-color)",
                borderRight:
                  activeTab === tab.id
                    ? "4px solid var(--accent-color)"
                    : "4px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 content-area">
        {activeTab === "profile" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">👤 Profile Settings</h3>
            <div className="settings-card">
              <div className="settings-info">
                <p>
                  <strong>Username:</strong> {user?.username || "Loading..."}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email || "Loading..."}
                </p>
                <p>
                  <strong>Bio:</strong> {user?.bio || "No bio added yet"}
                </p>
              </div>
              <button className="edit-btn" onClick={() => setIsModalOpen(true)}>
                Edit Profile
              </button>
            </div>

            {isModalOpen && (
              <SettingsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentUser={user}
                onProfileUpdated={setUser}
              />
            )}

            {/* 🌙 Theme Toggle */}
            <div style={{ marginTop: "1.5rem" }}>
              <h4 className="font-medium mb-2">Theme</h4>
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text-color)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {theme === "light"
                  ? "🌙 Enable Dark Mode"
                  : "☀️ Enable Light Mode"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">🔒 Privacy Settings</h3>
            <p>Manage who can see your activity and data.</p>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">
              🔔 Notification Settings
            </h3>
            <p>Choose how you want to receive alerts.</p>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">💳 Billing</h3>
            <p>View invoices, manage subscriptions, and payment methods.</p>
          </div>
        )}

        {activeTab === "apps" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">🔗 Connected Apps</h3>
            <p>Manage integrations with third-party apps.</p>
          </div>
        )}

        {activeTab === "danger" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              ⚠️ Danger Zone
            </h3>
            <p>Delete your account or reset everything.</p>
            <button className="delete-btn">Delete Account</button>
          </div>
        )}
      </main>
    </div>
  );
}
