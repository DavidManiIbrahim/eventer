import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Play, Calendar, MapPin, Search, Video } from "lucide-react";
import API from "../api/axios";
import GoLiveModal from "./GoLiveModal";
import "./css/LiveEvents.css";

const PORT_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LiveEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/events")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const liveEvents = useMemo(() => {
    return events.filter(e =>
      e.liveStream?.isLive &&
      (e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.createdBy?.username?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [events, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="live-events-page">
      <div className="live-header-section">
        <h1 className="live-page-title">
          <div className="live-dot"></div>
          Live Now
        </h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search live streams..."
              className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full focus:ring-2 focus:ring-pink-500 outline-none w-64 transition-all focus:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsGoLiveOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all active:scale-95 whitespace-nowrap"
          >
            <Video size={18} />
            Go Live
          </button>
        </div>
      </div>

      <div className="live-events-grid">
        {liveEvents.length === 0 ? (
          <div className="live-no-events">
            <h3 className="text-xl font-bold mb-2">No live events found</h3>
            <p className="text-slate-500">Check back later or try a different search.</p>
          </div>
        ) : (
          liveEvents.map((event) => (
            <div
              key={event._id}
              className="stream-card"
              onClick={() => navigate(`/live/${event._id}`)}
            >
              <div className="stream-thumbnail-wrapper">
                {event.image ? (
                  <img
                    src={`${PORT_URL}/uploads/event_image/${event.image}`}
                    alt={event.title}
                    className="stream-thumbnail"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <Play size={40} className="text-pink-500 opacity-30" />
                  </div>
                )}

                <div className="card-live-badge">LIVE</div>
                <div className="card-viewer-count">
                  <Users size={12} />
                  {Math.floor(Math.random() * 200) + 10}
                </div>
              </div>

              <div className="stream-card-content">
                {event.createdBy?.profilePic ? (
                  <img
                    src={`${PORT_URL}/uploads/profile_pic/${event.createdBy.profilePic}`}
                    alt={event.createdBy.username}
                    className="stream-channel-avatar"
                  />
                ) : (
                  <div className="stream-channel-avatar bg-pink-500 flex items-center justify-center font-bold text-white">
                    {event.createdBy?.username?.charAt(0) || "U"}
                  </div>
                )}

                <div className="stream-details">
                  <h3 className="stream-card-title">{event.title}</h3>
                  <p className="stream-card-creator">{event.createdBy?.username || "Organizer"}</p>
                  <div className="flex items-center gap-2">
                    <span className="stream-card-category">{event.category || "Event"}</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin size={10} /> {event.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <GoLiveModal
        isOpen={isGoLiveOpen}
        onClose={() => setIsGoLiveOpen(false)}
        onStreamStarted={(eventId) => navigate(`/live/${eventId}`)}
      />
    </div>
  );
}
