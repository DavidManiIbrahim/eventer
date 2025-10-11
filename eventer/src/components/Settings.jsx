import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { ThemeContext } from "../contexts/ThemeContexts";
import "./css/Settings.css";
import SettingsModal from "./EditProfileModal";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Privacy
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showActivity: false,
    searchable: true,
  });

  // Notifications
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    appPush: true,
    newsletter: false,
  });

  // Billing
  const [billing, setBilling] = useState({
    plan: "Free",
    nextBillingDate: "N/A",
  });

  const [saving, setSaving] = useState(false);
  const { id } = useParams();

  // 🧩 Fetch Logged-in User
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/settings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data.user || res.data;
        setUser(userData);
        console.log("Fetched user:", userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  // 🔒 Handle Privacy
  const handlePrivacyChange = (field) => {
    setPrivacy((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const savePrivacySettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      await API.put(
        `/settings/${id}/privacy`,
        privacy,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Privacy settings saved successfully!");
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      alert("❌ Failed to save privacy settings.");
    } finally {
      setSaving(false);
    }
  };

  // 🔔 Handle Notifications
  const handleNotificationChange = (field) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const saveNotificationSettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      await API.put(
        `/settings/notifications/${id}`,
        notifications,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Notification settings saved!");
    } catch (error) {
      console.error("Error saving notifications:", error);
      alert("❌ Failed to save notifications.");
    } finally {
      setSaving(false);
    }
  };

  // 💳 Handle Billing (Placeholder)
  const handleUpgradePlan = () => {
    alert("🔄 Redirecting to billing portal...");
  };

  // ⚠️ Handle Account Deletion
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone!")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/profile/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Account deleted successfully.");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("❌ Failed to delete account.");
    }
  };

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
        {/* 👤 PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">👤 Profile Settings</h3>
            <div className="settings-card">
              <div className="settings-info">
                <p>
                  <strong>Name:</strong> {user?.name || "Loading..."}
                </p>
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

        {/* 🔒 PRIVACY TAB */}
        {activeTab === "privacy" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">🔒 Privacy Settings</h3>
            <div className="privacy-options">
              {Object.keys(privacy).map((key) => (
                <label key={key} className="privacy-toggle">
                  <input
                    type="checkbox"
                    checked={privacy[key]}
                    onChange={() => handlePrivacyChange(key)}
                  />
                  {key === "showProfile"
                    ? "Show my profile publicly"
                    : key === "showActivity"
                    ? "Allow others to see my activity"
                    : "Allow my account to be found in search"}
                </label>
              ))}
            </div>
            <button className="save-btn" onClick={savePrivacySettings}>
              {saving ? "Saving..." : "💾 Save Privacy Settings"}
            </button>
          </div>
        )}

        {/* 🔔 NOTIFICATION TAB */}
        {activeTab === "notifications" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">🔔 Notification Settings</h3>
            <div className="privacy-options">
              {Object.keys(notifications).map((key) => (
                <label key={key} className="privacy-toggle">
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={() => handleNotificationChange(key)}
                  />
                  {key === "emailAlerts"
                    ? "Email alerts"
                    : key === "smsAlerts"
                    ? "SMS notifications"
                    : key === "appPush"
                    ? "In-app push notifications"
                    : "Subscribe to newsletter"}
                </label>
              ))}
            </div>
            <button className="save-btn" onClick={saveNotificationSettings}>
              {saving ? "Saving..." : "💾 Save Notification Settings"}
            </button>
          </div>
        )}

        {/* 💳 BILLING TAB */}
        {activeTab === "billing" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">💳 Billing</h3>
            <p>
              Current Plan: <strong>{billing.plan}</strong>
            </p>
            <p>Next Billing Date: {billing.nextBillingDate}</p>
            <button className="save-btn" onClick={handleUpgradePlan}>
              Upgrade Plan
            </button>
          </div>
        )}

        {/* 🔗 CONNECTED APPS TAB */}
        {activeTab === "apps" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">🔗 Connected Apps</h3>
            <p>Manage integrations with third-party apps (Google, Facebook, etc).</p>
            <button className="save-btn">Connect New App</button>
          </div>
        )}

        {/* ⚠️ DANGER ZONE TAB */}
        {activeTab === "danger" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              ⚠️ Danger Zone
            </h3>
            <p>This action cannot be undone. Proceed with caution!</p>
            <button className="delete-btn" onClick={deleteAccount}>
              Delete Account
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
