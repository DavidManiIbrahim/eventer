import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContexts";
import "./CSS/home.css";

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
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(term.toLowerCase()) ||
        event.location.toLowerCase().includes(term.toLowerCase()) ||
        event.category?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  return (
    <div data-theme={darkMode}>
      <div className="home-page min-h-screen py-8">
        <div className="max-w-7xl mx-auto pt-16 pl-20">
          {/* ✅ Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
            TickiSpot Events
          </h1>

          {/* ✅ Search Bar */}
          <div className="mb-8 flex justify-center">
            <input
              type="text"
              placeholder="Search by title, location or category..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input w-full md:w-1/2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-[var(--card-bg)] text-[var(--text-color)]"
            />
          </div>

          {/* ✅ Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mb-4 loader"></div>
              <p className="text-[var(--muted-text)]">Loading events...</p>
            </div>
          )}

          {/* ✅ Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">❌ {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="retry-btn px-6 py-2 rounded-lg shadow-md transition bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ✅ Event Grid */}
          {!loading && !error && (
            <>
              {filteredEvents.length === 0 ? (
                <p className="text-center text-[var(--muted-text)]">
                  {searchTerm
                    ? `No events found for "${searchTerm}".`
                    : "No events available yet."}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event) => (
                    <div
                      key={event._id}
                      className="event-card rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                    >
                      <Link to={`/eventdetail/${event._id}`}>
                        {/* 🖼 Image */}
                        {event.image ? (
                          <img
                            src={`${
                              import.meta.env.VITE_API_URL?.replace("/api", "") ||
                              PORT_URL
                            }/uploads/event_image/${event.image}`}
                            alt={event.title}
                            className="w-full h-52 object-cover"
                          />
                        ) : (
                          <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}

                        {/* 🧾 Event Info */}
                        <div className="p-5">
                          <h2 className="text-xl font-semibold mb-2 text-[var(--text-color)] truncate">
                            {event.title}
                          </h2>
                          <p className="text-[var(--muted-text)] text-sm mb-3 line-clamp-2">
                            {event.description || "No description provided."}
                          </p>

                          <div className="text-sm space-y-1 text-[var(--text-color)]">
                            <p>📍 {event.location || "Location TBA"}</p>

                            <p>
                              📅{" "}
                              {new Date(event.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}{" "}
                              at {event.startTime || "TBA"}
                            </p>

                            <p>
                              📅{" "}
                              {new Date(event.endDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}{" "}
                              at {event.endTime || "TBA"}
                            </p>

                            <p>
                              🎟 Tickets: {event.ticketsSold}/{event.totalTickets}
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

                            <p>🕹 Event Type: {event.eventType}</p>
                            {event.category && <p>🏷 Category: {event.category}</p>}
                          </div>

                          {/* 🔴 Live Status */}
                          {event.liveStream?.isLive && (
                            <div className="mt-4">
                              <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                🔴 LIVE NOW on {event.liveStream.streamType}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 👤 Organizer Info */}
                        <div className="border-t px-5 py-3 flex items-center gap-3 bg-[var(--card-bg)] border-[var(--border-color)]">
                          {event.createdBy?.profilePic ? (
                            <img
                              src={`${
                                import.meta.env.VITE_API_URL?.replace("/api", "") ||
                               `${PORT_URL}`
                              }/uploads/profile_pic/${event.createdBy.profilePic}`}
                              alt="Creator"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[var(--border-color)] flex items-center justify-center text-[var(--text-color)] font-semibold">
                              {event.createdBy?.username?.charAt(0).toUpperCase() ||
                                "U"}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-[var(--text-color)]">
                              {event.createdBy?.username || "Unknown Organizer"}
                            </p>
                            <p className="text-xs text-[var(--muted-text)]">Organizer</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
