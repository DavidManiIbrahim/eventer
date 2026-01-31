import { useEffect, useState } from "react";
import API from "../api/axios";
import LiveChat from "../components/LiveChats";
import { Link } from "react-router-dom";
import "./css/LiveEvents.css";


const PORT_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000";


export default function LiveEvent() {
  const [events, setEvents] = useState([]);
  const [buying, setBuying] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [activeEventId, setActiveEventId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    API.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleQuantityChange = (e, eventId) => {
    setBuying((prev) => ({ ...prev, [eventId]: e.target.value }));
  };

  const handleBuy = async (eventId) => {
    const quantity = parseInt(buying[eventId]) || 1;
    if (!user || !user.email) return alert("Login required.");

    const selectedEvent = events.find((e) => e._id === eventId);
    if (!selectedEvent) return alert("Event not found.");

    try {
      const res = await API.post("/payment/initiate", {
        email: user.email,
        amount: selectedEvent.ticketPrice * quantity,
        metadata: { eventId: selectedEvent._id, quantity },
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Payment failed to start");
    }
  };

  const handleJoinChat = (eventId) => {
    setActiveEventId(eventId);
    setShowChat(true);
  };

  return (
    <div className="live-events-page">
      {events.length === 0 && (
        <p className="live-no-events">No events available right now.</p>
      )}

      <div className="live-events-grid">
        {events
          .filter((e) => e.liveStream?.isLive)
          .map((event) => (
            <div key={event._id} className="live-event-card">
              <div className="live-event-header">
                <img
                  src={`${PORT_URL}/uploads/profile_pic/${event.createdBy?.profilePic}`}
                  alt={event.createdBy?.username || "Creator"}
                  className="live-creator-pic"
                />
                <div className="live-event-info">
                  <h2 className="live-event-title">{event.title}</h2>
                  <p className="live-event-meta">
                    {event.location} • {event.date}
                  </p>
                </div>
              </div>

              {event.image && (
                <img
                  src={`${PORT_URL}/uploads/event_image/${event.image}`}
                  alt={`${event.title} poster`}
                  className="live-event-image"
                />
              )}

              <div className="live-event-details">
                <p className="live-ticket-price">Price: ₦{event.ticketPrice}</p>
                <p className="live-tickets-left">
                  Tickets Left: {event.totalTickets}
                </p>
                <strong className="live-indicator">🔴 LIVE NOW</strong>

                {event.liveStream.streamType === "YouTube" && (
                  <iframe
                    className="live-video"
                    src={event.liveStream.streamURL.replace(
                      "watch?v=",
                      "embed/"
                    )}
                    title="YouTube Live Stream"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                )}

                {event.liveStream.streamType === "Facebook" && (
                  <div
                    className="live-fb-video"
                    data-href={event.liveStream.streamURL}
                    data-width="100%"
                    data-allowfullscreen="true"
                  ></div>
                )}

                <button
                  className="live-join-chat-btn"
                  onClick={() => handleJoinChat(event._id)}
                >
                  Join Live Chat
                </button>

                {showChat && activeEventId === event._id && (
                  <LiveChat
                    eventId={event._id}
                    username={user?.username || "Guest"}
                  />
                )}

                {isLoggedIn && (
                  <div className="live-buy-ticket">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={buying[event._id] || ""}
                      onChange={(e) => handleQuantityChange(e, event._id)}
                      className="live-buy-input"
                    />
                    <button
                      className="live-buy-btn"
                      onClick={() => handleBuy(event._id)}
                    >
                      Buy Ticket
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
