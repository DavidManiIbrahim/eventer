import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { jwtDecode } from "jwt-decode";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import "./CSS/Stats.css"; // Import the CSS for dark mode

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Decode token and check admin
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.isAdmin || false);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, [token]);

  // ✅ Fetch stats
  useEffect(() => {
    setLoading(true);
    setError(null);

    API.get("/stats/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      });
  }, [token]);

  function StatCard({ title, value }) {
    return (
      <div className="dashboard-card shadow-md rounded-lg p-4 flex flex-col items-center">
        <h3 className="text-sm">{title}</h3>
        <p className="text-2xl font-semibold text-primary">{value}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mb-4"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="mb-4 text-error">❌ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-error text-white rounded-md hover:opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="dashboard-container p-6 space-y-8 min-h-screen pt-16 pl-72">
      <h2 className="text-3xl font-bold">📊 Organizer Dashboard</h2>

      {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 mb-4 loader"></div>
            <p>Loading events...</p>
          </div>
        )}

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/users">
            <StatCard title="👥 Total Users" value={stats.totalUsers} />
          </Link>
          <StatCard title="🟢 Active Users" value={stats.activeUsers} />
          <StatCard title="🎤 Organizers" value={stats.organizers} />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Events" value={stats.totalEvents} />
        <StatCard title="Tickets Sold" value={stats.totalTicketsSold} />
        <StatCard title="Revenue (₦)" value={stats.totalRevenue} />
        <StatCard title="Live Events" value={stats.currentlyLive} />
      </div>

      <div className="dashboard-section rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🏆 Top Events</h3>
        {stats.topEvents?.length > 0 ? (
          <ul className="space-y-2">
            {stats.topEvents.map((event, i) => (
              <li
                key={i}
                className="flex justify-between bg-muted px-3 py-2 rounded-md"
              >
                <span className="font-medium">{event.title}</span>
                <span className="text-primary font-bold">
                  {event.quantitySold} tickets
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events yet.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="dashboard-section rounded-lg p-6">
          <h3 className="font-semibold mb-4">Tickets Sold per Event</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.perEventStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ticketsSold" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-section rounded-lg p-6">
          <h3 className="font-semibold mb-4">Revenue Share</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.perEventStats}
                dataKey="revenue"
                nameKey="title"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stats.perEventStats.map((_, index) => (
                  <Cell
                    key={index}
                    fill={["#4F46E5", "#10B981", "#F59E0B", "#EF4444"][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-section rounded-lg p-6">
        <h3 className="font-semibold mb-4">Revenue Trend (₦)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.perEventStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#10B981" />
            <Line type="monotone" dataKey="ticketsSold" stroke="#4F46E5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="dashboard-section rounded-lg p-6 overflow-x-auto">
        <h3 className="font-semibold mb-4">Event Breakdown</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted text-left">
              <th className="p-2">Event</th>
              <th className="p-2">Tickets Sold</th>
              <th className="p-2">Revenue (₦)</th>
              <th className="p-2">Attendees</th>
            </tr>
          </thead>
          <tbody>
            {stats.perEventStats.map((event) => (
              <tr key={event.id} className="border-t">
                <td className="p-2">{event.title}</td>
                <td className="p-2">{event.ticketsSold}</td>
                <td className="p-2">{event.revenue}</td>
                <td className="p-2">
                  {event.attendees.slice(0, 3).map((a, i) => (
                    <span key={i} className="block">
                      {a.buyer?.name} ({a.quantity})
                    </span>
                  ))}
                  {event.attendees.length > 3 && <em>+ more</em>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdmin && (
        <div className="admin-section border p-6 rounded-lg">
          <h2 className="text-xl font-bold">⚡ Admin Tools</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Manage Users</li>
            <li>Approve or Remove Events</li>
            <li>View Platform-wide Analytics</li>
          </ul>
        </div>
      )}
    </div>
  );
}
