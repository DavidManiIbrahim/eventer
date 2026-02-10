import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { ThemeContext } from "../contexts/ThemeContexts";
import "./css/Settings.css";
import SettingsModal from "./EditProfileModal";
import ThemeToggle from "./ThemeToggle";
import ToggleSwitch from "./ToggleSwitch";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { darkMode, toggleTheme } = useContext(ThemeContext);
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

      await API.put(`/settings/${id}/privacy`, privacy, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

      await API.put(`/settings/notifications/${id}`, notifications, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone!"
      )
    )
      return;
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
    <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="dashboard-container">
        <div className="settings-layout">
          {/* Settings Sidebar */}
          <aside className="settings-sidebar">
            <h2 className="settings-sidebar-title">
              ⚙️ Settings
            </h2>
            <nav className="settings-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`settings-nav-item ${activeTab === tab.id ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Settings Content */}
          <main className="settings-content">
            {/* 👤 PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="settings-panel">
                <h3 className="panel-title">👤 Profile Settings</h3>
                <div className="settings-card-profile">
                  <div className="settings-info-grid">
                    <div className="info-group">
                      <label>Name</label>
                      <div className="info-value">{user?.name || "Loading..."}</div>
                    </div>
                    <div className="info-group">
                      <label>Username</label>
                      <div className="info-value">@{user?.username || "Loading..."}</div>
                    </div>
                    <div className="info-group">
                      <label>Email</label>
                      <div className="info-value">{user?.email || "Loading..."}</div>
                    </div>
                    <div className="info-group full-width">
                      <label>Bio</label>
                      <div className="info-value">{user?.bio || "No bio added yet"}</div>
                    </div>
                  </div>
                  <button className="btn-primary mt-4" onClick={() => setIsModalOpen(true)}>
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

                <div className="settings-section mt-8">
                  <h4 className="section-subtitle">Appearance</h4>
                  <div className="theme-toggle-wrapper">
                    <span>Dark Mode</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            )}

            {/* 🔒 PRIVACY TAB */}
            {activeTab === "privacy" && (
              <div className="settings-panel">
                <h3 className="panel-title">🔒 Privacy Settings</h3>
                <div className="toggles-list">
                  {Object.keys(privacy).map((key) => (
                    <ToggleSwitch
                      key={key}
                      checked={privacy[key]}
                      onChange={() => handlePrivacyChange(key)}
                      label={
                        key === "showProfile"
                          ? "Show my profile publicly"
                          : key === "showActivity"
                            ? "Allow others to see my activity"
                            : "Allow my account to be found in search"
                      }
                    />
                  ))}
                </div>
                <button className="btn-primary mt-6" onClick={savePrivacySettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {/* 🔔 NOTIFICATION TAB */}
            {activeTab === "notifications" && (
              <div className="settings-panel">
                <h3 className="panel-title">🔔 Notification Settings</h3>
                <div className="toggles-list">
                  {Object.keys(notifications).map((key) => (
                    <ToggleSwitch
                      key={key}
                      checked={notifications[key]}
                      onChange={() => handleNotificationChange(key)}
                      label={
                        key === "emailAlerts"
                          ? "Email alerts"
                          : key === "smsAlerts"
                            ? "SMS notifications"
                            : key === "appPush"
                              ? "In-app push notifications"
                              : "Subscribe to newsletter"
                      }
                    />
                  ))}
                </div>
                <button className="btn-primary mt-6" onClick={saveNotificationSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {/* 💳 BILLING TAB */}
            {activeTab === "billing" && (
              <div className="settings-panel">
                <h3 className="panel-title">💳 Billing</h3>
                <div className="billing-card">
                  <div className="billing-info">
                    <p>Current Plan</p>
                    <div className="plan-name">{billing.plan}</div>
                  </div>
                  <div className="billing-info">
                    <p>Next Billing Date</p>
                    <div className="billing-date">{billing.nextBillingDate}</div>
                  </div>
                </div>
                <button className="btn-primary mt-6" onClick={handleUpgradePlan}>
                  Upgrade Plan
                </button>
              </div>
            )}

            {/* 🔗 CONNECTED APPS TAB */}
            {activeTab === "apps" && (
              <div className="settings-panel">
                <h3 className="panel-title">🔗 Connected Apps</h3>
                <p className="text-muted">
                  Manage integrations with third-party apps (Google, Facebook, etc).
                </p>
                <button className="btn-outline mt-4">Connect New App</button>
              </div>
            )}

            {/* ⚠️ DANGER ZONE TAB */}
            {activeTab === "danger" && (
              <div className="settings-panel danger-zone">
                <h3 className="panel-title text-danger">⚠️ Danger Zone</h3>
                <p className="text-muted mb-4">This action cannot be undone. Proceed with caution!</p>
                <button className="btn-danger" onClick={deleteAccount}>
                  Delete Account
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
