import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import "./CSS/Dashboard.css"; 
import EditEvent from "../components/EditEvent";
import { getCurrentUser } from "../utils/auth";
import { ArrowRight, PlusCircle } from "lucide-react";

const PORT_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const user = useMemo(() => getCurrentUser(), []);

  // 🟢 For Modal Control
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // 🟢 Functions
  const handleEditClick = (id) => {
    setSelectedEventId(id);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedEventId(null);
  };

  const handleEventUpdated = () => {
    API.get("/events/my-events").then((res) => setEvents(res.data));
  };

  // 🧩 Fetch dashboard data
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

  // 🟢 Toggle Live Event
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

  // 🗑 Delete Event
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

  const StatCard = ({ title, value }) => (
    <div className="stat-tile">
      <div className="stat-label">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <div className="dashboard-title">
              Organizer Dashboard
            </div>
            <div className="dashboard-subtitle">
              Welcome back{user?.username ? `, ${user.username}` : ""}. Manage your events, sales, and live sessions.
            </div>
          </div>

          <div className="dashboard-actions">
            <Link to="/events" className="dash-btn">
              Browse events <ArrowRight size={18} />
            </Link>
            <button className="dash-btn dash-btn-primary" onClick={() => navigate("/events")}>
              Create event <PlusCircle size={18} />
            </button>
          </div>
        </div>

        {/* 🔄 Loading */}
        {loading && (
          <div className="dash-card">
            <div className="dash-card-body">
              <p>Loading dashboard...</p>
            </div>
          </div>
        )}

        {/* ❌ Error */}
        {error && (
          <div className="dash-card">
            <div className="dash-card-body">
              <p style={{ color: "#dc2626", fontWeight: 800, marginBottom: "0.75rem" }}>
                {error}
              </p>
              <button className="dash-btn" onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          </div>
        )}

        {/* 📊 Stats */}
        {!loading && !error && stats && (
          <div className="dash-card" style={{ marginTop: "1rem" }}>
            <div className="dash-card-header">
              <div className="dash-card-title">Stats overview</div>
            </div>
            <div className="dash-card-body">
              <div className="stats-grid" style={{ marginBottom: "1rem" }}>
                <StatCard title="Total Events" value={stats.totalEvents} />
                <StatCard title="Tickets Sold" value={stats.totalTicketsSold} />
                <StatCard title="Revenue (₦)" value={stats.totalRevenue} />
                <StatCard title="Live Events" value={stats.currentlyLive} />
              </div>

              <div className="section-title">Top events</div>
              {stats.topEvents?.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                  {stats.topEvents.map((event, i) => (
                    <li key={i} style={{ marginBottom: "0.35rem" }}>
                      <span style={{ fontWeight: 800 }}>{event.title}</span> —{" "}
                      {event.quantitySold} tickets
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "rgba(0,0,0,0.55)" }}>No events yet.</p>
              )}
            </div>
          </div>
        )}

        {/* 🎫 Events */}
        {!loading && !error && (
          <>
            <div className="section-title">Your events</div>
            {events.length === 0 ? (
              <div className="dash-card">
                <div className="dash-card-body">
                  <p style={{ color: "rgba(0,0,0,0.55)" }}>
                    You haven’t created any events yet.
                  </p>
                  <div style={{ marginTop: "1rem" }}>
                    <Link className="dash-btn dash-btn-primary" to="/events">
                      Explore events <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="events-grid">
                {events.map((event) => (
                  <div key={event._id} className="event-card">
                    {event.image && (
                      <img
                        src={`${PORT_URL}/uploads/event_image/${event.image}`}
                        alt={event.title}
                        className="event-cover"
                      />
                    )}

                    <div className="event-body">
                      <div className="event-title-row">
                        <div className="event-title">{event.title}</div>
                        {event.liveStream?.isLive && (
                          <span className="event-badge-live">LIVE</span>
                        )}
                      </div>

                      <div className="event-meta">
                        {event.description || "No description provided."}
                      </div>
                      <div className="event-meta" style={{ marginTop: "0.5rem" }}>
                        {new Date(event.startDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        {event.startTime ? `at ${event.startTime}` : ""} • {event.location}
                      </div>
                      <div className="event-meta" style={{ marginTop: "0.5rem" }}>
                        Tickets: {event.ticketsSold}/{event.totalTickets} • Type: {event.eventType}
                        {event.category ? ` • Category: ${event.category}` : ""}
                      </div>
                    </div>

                    <div className="event-actions">
                      <button
                        onClick={() => toggleLive(event._id, event.liveStream?.isLive)}
                        className={`pill-btn ${event.liveStream?.isLive ? "pill-btn-danger" : "pill-btn-primary"}`}
                      >
                        {event.liveStream?.isLive ? "Stop live" : "Go live"}
                      </button>
                      <button onClick={() => handleEditClick(event._id)} className="pill-btn pill-btn-primary">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(event._id)} className="pill-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ✅ Place the EditEvent modal here once */}
        <EditEvent
          isOpen={editModalOpen}
          onClose={handleModalClose}
          eventId={selectedEventId}
          onEventUpdated={handleEventUpdated}
        />
      </div>
    </div>
  );
}
