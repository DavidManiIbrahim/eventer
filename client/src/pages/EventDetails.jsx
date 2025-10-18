import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import LiveChat from "../components/LiveChats";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContexts"; // ✅ Added
import "./CSS/eventdetail.css";

const PORT_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [activeEventId, setActiveEventId] = useState(null);
  const [zeroTicket, setZeroTicket] = useState()

  const { darkMode } = useContext(ThemeContext); // ✅ Access current theme
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Apply dark/light mode dynamically
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode);
  }, [darkMode]);

  useEffect(() => {
    API.get(`/events/${eventId}`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventId]);

  const handleQuantityChange = (e, eventId) => {
    setBuying((prev) => ({ ...prev, [eventId]: e.target.value }));
  };

  

  const handleBuy = () => {
    const quantity = parseInt(buying[event._id]) || 1;
    if (!user || !user.email) {
      alert("Please login to purchase tickets.");
      return;
    }
    navigate(`/checkout/${event._id}`, {
      state: { event, quantity, user },
    });
  };

  const handleJoinChat = (eventId) => {
    setActiveEventId(eventId);
    setShowChat(true);
  };

  if (loading)
    return <p className="event-loading text-center mt-16">Loading event...</p>;
  if (!event)
    return <p className="event-loading text-center mt-16">Event not found.</p>;

  return (
    <div
      className={`event-detail min-h-screen py-12 px-4 transition-colors duration-300 ${darkMode ? "dark-mode" : ""}
      }`}
    >
      <div
        className={`max-w-5xl mx-auto rounded-2xl shadow-lg overflow-hidden relative transition-all duration-300 ${
          darkMode === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* ✅ Event Banner */}
        {event.image && (
          <img
            src={`${
              import.meta.env.VITE_API_URL?.replace("/api", "") || `${PORT_URL}`
            }/uploads/event_image/${event.image}`}
            alt={event.title}
            className="w-full h-80 object-cover"
          />
        )}

        {/* ✅ Event Info */}
        <div className="p-8">
          <div className="flex justify-between items-start flex-wrap gap-3">
            <h1 className="text-3xl font-bold">{event.title}</h1>

            {event.liveStream?.isLive && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                🔴 LIVE NOW
              </span>
            )}
          </div>

          {event.category && (
            <p
              className={`mt-2 text-sm italic ${
                darkMode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              🏷 Category: {event.category}
            </p>
          )}

          <p
            className={`mt-4 leading-relaxed text-lg ${
              darkMode === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {event.description}
          </p>

          {/* ✅ Event Meta Info */}
          <div
            className={`mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-3 ${
              darkMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <p>📍 <strong>Location:</strong> {event.location}</p>
            <p>
              📅 <strong>Date:</strong>{" "}
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>⏰ <strong>Time:</strong> {event.time}</p>
            <p>💰 <strong>Ticket Price:</strong> ₦{event.ticketPrice}</p>
            <p>
              🎟 <strong>Tickets Available:</strong>{" "}
              {event.totalTickets - (event.ticketsSold || 0)} /{" "}
              {event.totalTickets}
            </p>
          </div>

          {/* ✅ Live Stream Section */}
          {event.liveStream?.isLive && event.liveStream.streamURL && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">🎥 Live Stream</h3>

              {event.liveStream.streamType === "YouTube" && (
                <iframe
                  className="w-full h-80 rounded-xl"
                  src={event.liveStream.streamURL.replace("watch?v=", "embed/")}
                  title="YouTube Live Stream"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              )}

              {event.liveStream.streamType === "Facebook" && (
                <div
                  className="fb-video"
                  data-href={event.liveStream.streamURL}
                  data-width="100%"
                  data-allowfullscreen="true"
                ></div>
              )}

              {event.liveStream.streamType === "Custom" && (
                <a
                  href={event.liveStream.streamURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Watch Stream
                </a>
              )}

              <button
                onClick={() => handleJoinChat(event._id)}
                className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                💬 Join Live Chat
              </button>
            </div>
          )}

          {/* ✅ Ticket Purchase Section */}
          {isLoggedIn && (
            <div
              className={`ticket-purchase mt-10 border-t pt-6 ${
                darkMode === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold mb-3">🎫 Purchase Tickets</h3>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  className={`w-20 border rounded-lg px-2 py-2 text-center ${
                    darkMode === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  value={buying[event._id] || "1"}
                  onChange={(e) => handleQuantityChange(e, event._id)}
                />
                <button
                  onClick={handleBuy}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Buy Ticket
                </button>
              </div>
            </div>
          )}

          {/* ✅ Organizer Info */}
          {event.createdBy && (
            <div
              className={`organizer-info mt-10 border-t pt-6 flex items-center gap-4 ${
                darkMode === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              {event.createdBy.profilePic ? (
                <img
                  src={`${
                    import.meta.env.VITE_API_URL?.replace("/api", "") ||
                    `${PORT_URL}`
                  }/uploads/profile_pic/${event.createdBy.profilePic}`}
                  alt="Organizer"
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
                  {event.createdBy.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div>
                <p className="font-semibold">{event.createdBy.username}</p>
                <p
                  className={`text-sm ${
                    darkMode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Event Organizer
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Live Chat Sidebar */}
        {showChat && activeEventId === event._id && (
          <div
            className={`chat-sidebar fixed top-0 right-0 w-full md:w-1/3 h-full z-50 shadow-2xl transition-all duration-300 ${
              darkMode === "dark" ? "bg-gray-800 text-gray-100" : "bg-white"
            }`}
          >
            <div
              className={`chat-header flex justify-between items-center p-4 border-b ${
                darkMode === "dark"
                  ? "bg-indigo-700 border-gray-700"
                  : "bg-indigo-600 text-white"
              }`}
            >
              <h2 className="font-semibold">💬 Live Chat</h2>
              <button
                onClick={() => setShowChat(false)}
                className="text-xl font-bold"
              >
                ✖
              </button>
            </div>
            <div className="chat-body p-4 overflow-y-auto h-[calc(100%-60px)]">
              <LiveChat
                eventId={event._id}
                username={user?.username || "Guest"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
