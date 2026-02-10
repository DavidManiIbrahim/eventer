import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { ThemeContext } from "../contexts/ThemeContexts";
import { Search, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";
import "./CSS/home.css";
import "./CSS/landing.css"; // Ensure landing styles are available

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return new Intl.NumberFormat('en-NG').format(num);
};

const PORT_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    setLoading(true);
    setError(null);

    API.get("/events")
      .then((res) => {
        setEvents(res.data);
        setFilteredEvents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load events. Please try again.");
        setLoading(false);
      });
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setFilteredEvents(
      events.filter(
        (event) =>
          event.title.toLowerCase().includes(term.toLowerCase()) ||
          event.location?.toLowerCase().includes(term.toLowerCase()) ||
          event.category?.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  return (
    <div className={`landing-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="grid-background"></div>
      <LandingNavbar />

      <div style={{ paddingTop: "100px", minHeight: "100vh", paddingBottom: "60px" }}>
        <div className="dashboard-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          {/* Header */}
          <div className="dashboard-header" style={{ marginBottom: "2rem" }}>
            <div className="section-header animate-in" style={{ textAlign: "left", marginBottom: "1rem" }}>
              <h1 className="section-title">
                <span className="title-box title-box-border">Explore</span>
                <span className="title-box title-box-filled">Events</span>
              </h1>
              <p className="section-subtitle" style={{ margin: "1rem 0" }}>
                Browse and discover events on TickiSpot
              </p>
            </div>

            <div className="dashboard-actions">
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by title, location or category..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="dash-search"
                />
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="dash-card">
              <div className="dash-card-body center muted">
                Loading events…
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="dash-card">
              <div className="dash-card-body center">
                <p className="error-text">{error}</p>
                <button
                  className="dash-btn"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Events */}
          {!loading && !error && (
            <>
              {filteredEvents.length === 0 ? (
                <div className="dash-card">
                  <div className="dash-card-body center muted">
                    {searchTerm
                      ? `No events found for "${searchTerm}".`
                      : "No events available yet."}
                  </div>
                </div>
              ) : (
                <div className="events-grid">
                  {filteredEvents.map((event) => (
                    <Link
                      to={`/eventdetail/${event._id}`}
                      key={event._id}
                      className="event-card feature-card animate-in"
                      style={{ textDecoration: "none", padding: 0, overflow: "hidden" }}
                    >
                      {/* Modern Image Container */}
                      <div className="event-image-container">
                        {event.image ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL?.replace("/api", "") ||
                              PORT_URL
                              }/uploads/event_image/${event.image}`}
                            alt={event.title}
                            className="event-image"
                          />
                        ) : (
                          <div className="event-image placeholder">
                            No Image
                          </div>
                        )}

                        {/* Floating Badges */}
                        <div className="event-floating-badges">
                          {event.category && (
                            <span className="event-category-badge">{event.category}</span>
                          )}
                          {event.liveStream?.isLive && (
                            <span className="live-pill-floating">
                              <span className="live-dot pulse"></span>
                              LIVE
                            </span>
                          )}
                        </div>

                        {/* Hover Overlay */}
                        <div className="event-hover-overlay">
                          <span className="view-details-btn">View Details <ArrowRight size={16} /></span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="event-body" style={{ padding: "1.5rem" }}>
                        <div className="event-title-row">
                          <h3 className="event-title" style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{event.title}</h3>
                        </div>

                        <p className="event-desc" style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                          {event.description || "Join us for this amazing event and experience something unique."}
                        </p>

                        <div className="event-info-grid">
                          <div className="info-item">
                            <MapPin size={16} className="info-icon" />
                            <span>{event.location || "Online / TBA"}</span>
                          </div>
                          <div className="info-item">
                            <Calendar size={16} className="info-icon" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="info-item tickets-info">
                            <Users size={16} className="info-icon" />
                            <span>{formatNumber(event.ticketsSold)}/{formatNumber(event.totalTickets)} Attendee</span>
                          </div>
                        </div>
                      </div>

                      {/* Organizer */}
                      <div className="event-footer" style={{ borderTop: "1px solid var(--border-color)", padding: "1rem 1.5rem" }}>
                        {event.createdBy?.profilePic ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL?.replace("/api", "") ||
                              PORT_URL
                              }/uploads/profile_pic/${event.createdBy.profilePic}`}
                            alt="Organizer"
                            style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                          />
                        ) : (
                          <div className="avatar-fallback" style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {event.createdBy?.username?.charAt(0) || "U"}
                          </div>
                        )}
                        <div style={{ marginLeft: "0.75rem" }}>
                          <p className="organizer-name" style={{ fontSize: "0.9rem", fontWeight: "600", margin: 0 }}>
                            {event.createdBy?.username || "Unknown Organizer"}
                          </p>
                          <span className="organizer-role" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Organizer</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
