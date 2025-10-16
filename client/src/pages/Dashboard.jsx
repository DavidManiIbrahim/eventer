import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./CSS/Dashboard.css";

const PORT_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      API.get("/events/my-events"),
      API.get("/stats/stats", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([eventsRes, statsRes]) => {
        setEvents(eventsRes.data);
        setStats(statsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard Error:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      });
  }, [token]);

  const toggleLive = async (id, currentStatus) => {
    try {
      await API.patch("/events/toggle-live", {
        eventId: id,
        isLive: !currentStatus,
      });
      setEvents(
        events.map((ev) =>
          ev._id === id
            ? {
                ...ev,
                liveStream: { ...ev.liveStream, isLive: !currentStatus },
              }
            : ev
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to toggle live status");
    }
  };

  const handleDelete = async (id) => {
    const eventToDelete = events.find((e) => e._id === id);
    const confirmed = window.confirm(
      `Are you sure you want to delete "${eventToDelete?.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await API.delete(`/events/delete/${id}`);
      setEvents(events.filter((e) => e._id !== id));
      alert("Event deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete event. Please try again.");
    }
  };

  const handleEdit = (id) => navigate(`/edit/${id}`);

  const StatCard = ({ title, value }) => (
    <div className="stat-card bg-white shadow rounded-xl p-4 text-center border transition-all hover:scale-105">
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
    </div>
  );

  return (
    <div className="dashboard-layout min-h-screen bg-gray-50 pt-16 pl-72 px-6">
      <h2 className="text-3xl font-bold mb-8">🎛 Organizer Dashboard</h2>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-10 text-red-600">
          <p className="mb-2">❌ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats */}
      {!loading && !error && stats && (
        <div className="stats-wrapper bg-white shadow rounded-xl p-6 mb-10 border transition-all">
          <h4 className="text-lg font-semibold mb-4">📊 Stats Overview</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Events" value={stats.totalEvents} />
            <StatCard title="Tickets Sold" value={stats.totalTicketsSold} />
            <StatCard title="Revenue (₦)" value={stats.totalRevenue} />
            <StatCard title="Live Events" value={stats.currentlyLive} />
          </div>

          <h3 className="text-md font-semibold mb-2">🏆 Top Events</h3>
          {stats.topEvents?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {stats.topEvents.map((event, i) => (
                <li key={i}>
                  <span className="font-medium">{event.title}</span> —{" "}
                  {event.quantitySold} tickets
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No events yet.</p>
          )}
        </div>
      )}

      {/* Events */}
      <h4 className="text-lg font-semibold mb-4">Your Events</h4>
      {events.length === 0 ? (
        <p className="text-gray-500">You haven’t created any events yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="event-card bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {event.image && (
                <img
                  src={`${PORT_URL}/uploads/event_image/${event.image}`}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {event.title}
                  </h3>
                  {event.liveStream?.isLive && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm capitalize">
                  {event.description || "No description provided."}
                </p>
                <p className="text-gray-700 text-sm">
                  📅{" "}
                  {new Date(event.startDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at {event.startTime || "TBA"} • 📍 {event.location}
                </p>
                {event.pricing?.length > 0 && (
                  <div>
                    <p>💰 Pricing:</p>
                    {event.pricing.map((price, index) => (
                      <p key={index} className="ml-3">
                        • {price.type}: ₦{price.price}
                      </p>
                    ))}
                  </div>
                )}
                <p>
                              🎟 Tickets: {event.ticketsSold}/{event.totalTickets}
                            </p>
                            <p>🕹 Event Type: {event.eventType}</p>
                            {event.category && <p>🏷 Category: {event.category}</p>}
                
              </div>

              <div className="flex justify-between items-center gap-2 p-4 border-t">
                <button
                  onClick={() =>
                    toggleLive(event._id, event.liveStream?.isLive)
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    event.liveStream?.isLive
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  }`}
                >
                  {event.liveStream?.isLive ? "🔴 Stop Live" : "🟢 Go Live"}
                </button>
                <button
                  onClick={() => handleEdit(event._id)}
                  className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
