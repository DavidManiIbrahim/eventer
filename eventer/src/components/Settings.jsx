import { useState, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContexts";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, toggleTheme } = useContext(ThemeContext);

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
      className="min-h-screen flex ml-64 pt-16"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Sidebar */}
      <aside
        className="w-64 border-r hidden md:block"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <h2 className="text-xl font-semibold px-6 py-4 border-b">⚙️ Settings</h2>
        <nav className="mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-6 py-3 text-sm font-medium transition`}
              style={{
                backgroundColor:
                  activeTab === tab.id ? "var(--border-color)" : "transparent",
                color:
                  activeTab === tab.id ? "var(--text-color)" : "var(--text-color)",
                borderRight:
                  activeTab === tab.id
                    ? "4px solid var(--text-color)"
                    : "4px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "profile" && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">👤 Profile Settings</h3>
            <p className="mb-4">
              Update your name, email, and profile picture.
            </p>

            {/* 🌙 Theme Toggle Button */}
            <div style={{ marginTop: "1.5rem" }}>
              <h4 className="font-medium mb-2">Theme</h4>
              <button
                onClick={toggleTheme}
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text-color)",
                  border: "1px solid var(--border-color)",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {theme === "light" ? "🌙 Enable Dark Mode" : "☀️ Enable Light Mode"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">🔒 Privacy Settings</h3>
            <p>Manage who can see your activity and data.</p>
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">🔔 Notification Settings</h3>
            <p>Choose how you want to receive alerts.</p>
          </div>
        )}

        {activeTab === "billing" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">💳 Billing</h3>
            <p>View invoices, manage subscriptions, and payment methods.</p>
          </div>
        )}

        {activeTab === "apps" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">🔗 Connected Apps</h3>
            <p>Manage integrations with third-party apps.</p>
          </div>
        )}

        {activeTab === "danger" && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              ⚠️ Danger Zone
            </h3>
            <p>Delete your account or reset everything.</p>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
              Delete Account
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
