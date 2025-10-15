import { useEffect, useState } from "react";
import API from "../api/axios";
import LiveChat from "../components/LiveChats";
import { useNavigate, useParams } from "react-router-dom";
import "./CSS/eventdetail.css"; // ✅ Import CSS file

const PORT_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000";

export default function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [activeEventId, setActiveEventId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/events/${eventId}`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [eventId]);

  const handleQuantityChange = (e, eventId) => {
    setBuying((prev) => ({ ...prev, [eventId]: e.target.value }));
  };

  const handleBuy = () => {
    const quantity = parseInt(buying[event._id]) || 1;
    if (!user || !user.email) {
      alert("Login required.");
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

  if (loading) return <p className="event-loading">Loading event...</p>;
  if (!event) return <p className="event-loading">Event not found</p>;

  return (
    <div className="event-detail">
      <div className="event-container">
        <h1 className="event-title">Event Details</h1>

        <div className="event-card">
          <h2 className="event-name">{event.title}</h2>
          <p className="event-description">{event.description}</p>
          <p className="event-location">{event.location}</p>
          <p className="event-date">
            Date: {new Date(event.date).toLocaleDateString()} at {event.time}
          </p>
          <p className="event-price">Price: ₦{event.ticketPrice}</p>
          <p className="event-tickets">
            Tickets Left: {event.totalTickets - event.ticketsSold}
          </p>

          {event.image && (
            <img
              src={`${
                import.meta.env.VITE_API_URL?.replace("/api", "") ||
                `${PORT_URL}`
              }/uploads/event_image/${event.image}`}
              alt={event.title}
              className="event-image"
            />
          )}

          {/* ✅ Live Stream Section */}
          {event.liveStream?.isLive && (
            <div className="event-live">
              <strong className="live-label">🔴 LIVE NOW</strong>

              {event.liveStream.streamType === "YouTube" && (
                <iframe
                  className="live-frame"
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
                  data-width="500"
                  data-allowfullscreen="true"
                ></div>
              )}

              <button
                onClick={() => handleJoinChat(event._id)}
                className="join-chat-btn"
              >
                Join Live Chat
              </button>
            </div>
          )}

          {/* ✅ Ticket Purchase Section */}
          {isLoggedIn && (
            <div className="ticket-purchase">
              <input
                type="number"
                min="1"
                className="ticket-input"
                placeholder="Qty"
                value={buying[event._id] || "1"}
                onChange={(e) => handleQuantityChange(e, event._id)}
              />
              <button onClick={handleBuy} className="buy-btn">
                Buy Ticket
              </button>
            </div>
          )}
        </div>

        {/* ✅ Live Chat Sidebar */}
        {showChat && activeEventId === event._id && (
          <div className="chat-sidebar">
            <div className="chat-header">
              <h2>💬 Live Chat</h2>
              <button onClick={() => setShowChat(false)} className="close-chat">
                ✖
              </button>
            </div>
            <div className="chat-body">
              <LiveChat eventId={event._id} username={user?.username || "Guest"} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
