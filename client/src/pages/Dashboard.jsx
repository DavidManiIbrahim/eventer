import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import "./CSS/Dashboard.css";
import EditEvent from "../components/EditEvent";
import { getCurrentUser } from "../utils/auth";
import {
  ArrowRight,
  PlusCircle,
  LayoutDashboard,
  Ticket,
  BarChart3,
  Radio,
  Calendar,
  MapPin,
  Users
} from "lucide-react";
import CreateEvent from "./CreateEvent";

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

  const [showCreateEvent, setShowCreateEvent] = useState(false); // ✅ Modal state


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
            : ev,
        ),
      );

      if (!currentStatus) {
        navigate(`/live/${id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to toggle live status");
    }
  };

  // 🗑 Delete Event
  const handleDelete = async (id) => {
    const eventToDelete = events.find((e) => e._id === id);
    const confirmed = window.confirm(
      `Are you sure you want to delete "${eventToDelete?.title}"?\n\nThis action cannot be undone.`,
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

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`stat-tile ${color}`}>
      <div className="stat-tile-content">
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-tile-icon-wrapper">
        <Icon size={24} className="stat-tile-icon" />
      </div>
    </div>
  );

  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "0";
    return new Intl.NumberFormat('en-NG').format(num);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <div className="dashboard-title">Organizer Dashboard</div>
            <div className="dashboard-subtitle">
              Welcome back{user?.username ? `, ${user.username}` : ""}. Manage
              your events, sales, and live sessions.
            </div>
          </div>

          <div className="dashboard-actions">
            <Link to="/events" className="dash-btn">
              Browse events <ArrowRight size={18} />
            </Link>
            <button
              className="dash-btn dash-btn-primary"
              onClick={() => setShowCreateEvent(true)}
            >
              Create event <PlusCircle size={18}
              />
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
              <p
                style={{
                  color: "#dc2626",
                  fontWeight: 800,
                  marginBottom: "0.75rem",
                }}
              >
                {error}
              </p>
              <button
                className="dash-btn"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* 📊 Stats */}
        {!loading && !error && stats && (
          <div className="stats-container-grid">
            <StatCard
              title="Total Events"
              value={stats.totalEvents}
              icon={LayoutDashboard}
              color="blue"
            />
            <StatCard
              title="Tickets Sold"
              value={formatNumber(stats.totalTicketsSold)}
              icon={Ticket}
              color="pink"
            />
            <StatCard
              title="Revenue"
              value={`₦${formatNumber(stats.totalRevenue)}`}
              icon={BarChart3}
              color="green"
            />
            <StatCard
              title="Live Sessions"
              value={stats.currentlyLive}
              icon={Radio}
              color="red"
            />
          </div>
        )}

        {!loading && !error && stats && stats.topEvents?.length > 0 && (
          <div className="dash-card top-events-card">
            <div className="dash-card-header">
              <div className="dash-card-title">Top Performing Events</div>
            </div>
            <div className="dash-card-body">
              <div className="top-events-list">
                {stats.topEvents.map((event, i) => (
                  <div key={i} className="top-event-item">
                    <div className="top-event-rank">#{i + 1}</div>
                    <div className="top-event-info">
                      <div className="top-event-name">{event.title}</div>
                      <div className="top-event-sales">{formatNumber(event.quantitySold || event.ticketsSold || 0)} tickets sold</div>
                    </div>
                    <div className="top-event-progress">
                      <div
                        className="top-event-progress-bar"
                        style={{ width: `${Math.min(100, ((event.quantitySold || event.ticketsSold || 0) / (stats.totalTicketsSold || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 🎫 Events */}
        {!loading && !error && (
          <>
            <div className="section-title">Your events</div>
            {events.length === 0 ? (
              <div className="dash-card empty-state-card">
                <div className="dash-card-body">
                  <p className="empty-state-p">
                    You haven’t created any events yet. Ready to host your first one?
                  </p>
                  <div style={{ marginTop: "1rem" }}>
                    <button onClick={() => setShowCreateEvent(true)} className="dash-btn dash-btn-primary">
                      Create Your First Event <PlusCircle size={18} />
                    </button>
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
                      <div className="event-meta-grid">
                        <div className="event-meta-item">
                          <Calendar size={14} className="meta-icon" />
                          <span>
                            {new Date(event.startDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })} • {event.startTime}
                          </span>
                        </div>
                        <div className="event-meta-item">
                          <MapPin size={14} className="meta-icon" />
                          <span>{event.location}</span>
                        </div>
                        <div className="event-meta-item">
                          <Users size={14} className="meta-icon" />
                          <span>{event.ticketsSold}/{event.totalTickets} tickets sold</span>
                        </div>
                      </div>
                    </div>

                    <div className="event-actions">
                      <button
                        onClick={() =>
                          toggleLive(event._id, event.liveStream?.isLive)
                        }
                        className={`pill-btn ${event.liveStream?.isLive ? "pill-btn-danger" : "pill-btn-primary"}`}
                      >
                        {event.liveStream?.isLive ? "Stop live" : "Go live"}
                      </button>
                      <button
                        onClick={() => handleEditClick(event._id)}
                        className="pill-btn pill-btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="pill-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {/* ✅ Place the EditEvent modal here once */}

      <EditEvent
        isOpen={editModalOpen}
        onClose={handleModalClose}
        eventId={selectedEventId}
        onEventUpdated={handleEventUpdated}
      />
      {/* ✅ Create Event Modal */}
      <CreateEvent
        isOpen={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
      />
    </div>
  );
}
