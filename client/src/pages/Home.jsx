import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import "./CSS/home.css";

const PORT_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="home-page min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto pt-16 pl-64">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          TickiSpot
        </h1>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 mb-4 loader"></div>
            <p>Loading events...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8">
            <p className="error-text mb-4">❌ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-btn px-6 py-2 rounded-lg shadow-md transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search events by title or location..."
                value={searchTerm}
                onChange={(e) => {
                  const term = e.target.value;
                  setSearchTerm(term);
                  const filtered = events.filter(
                    (event) =>
                      event.title.toLowerCase().includes(term.toLowerCase()) ||
                      event.location.toLowerCase().includes(term.toLowerCase())
                  );
                  setFilteredEvents(filtered);
                }}
                className="search-input w-full px-4 py-2 border rounded-lg focus:ring-2"
              />
            </div>

            {/* No results */}
            {filteredEvents.length === 0 && (
              <p className="text-center no-results">
                {searchTerm
                  ? `No events found matching "${searchTerm}"`
                  : "No events yet."}
              </p>
            )}

            {/* Events grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event._id} className="event-card rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
                  <Link to={`/eventdetail/${event._id}`} className="block">
                    {/* Creator info */}
                    <div className="flex items-center gap-3 p-4 border-b">
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL?.replace("/api", "") ||
                          `${PORT_URL}`
                        }/uploads/profile_pic/${event.createdBy?.profilePic}`}
                        alt={event.createdBy?.username || "Creator"}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="hidden w-10 h-10 rounded-full fallback-avatar items-center justify-center font-bold">
                        {event.createdBy?.username?.charAt(0) || "U"}
                      </div>
                      <h2 className="text-lg font-semibold">{event.title}</h2>
                    </div>

                    {/* Event image */}
                    {event.image && (
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL?.replace("/api", "") ||
                          `${PORT_URL}`  
                        }/uploads/event_image/${event.image}`}
                        alt={`${event.title} poster`}
                        className="event-image w-full h-48 object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}

                    {/* Event details */}
                    <div className="p-4 event-details">
                      <p className="mb-2">
                        📍 {event.location} •{" "}
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p>💰 Price: ₦{event.ticketPrice}</p>
                      <p>🎟 Tickets Left: {event.totalTickets}</p>

                      {event.liveStream?.isLive && (
                        <div className="mt-4">
                          <span className="live-badge inline-block px-3 py-1 rounded-full text-sm font-medium">
                            🔴 LIVE NOW
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
