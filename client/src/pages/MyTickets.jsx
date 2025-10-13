import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import LiveChat from "../components/LiveChats";
import "./CSS/MyTickets.css"; // ✅ Import CSS for dark mode
import { ThemeContext } from "../contexts/ThemeContexts"; // ✅ Use global theme

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [activeEventId, setActiveEventId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const { darkMode } = useContext(ThemeContext); // 🌙 Access theme state

  useEffect(() => {
    API.get("/tickets/my-tickets")
      .then((res) => setTickets(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleJoinChat = (eventId) => {
    setActiveEventId(eventId);
    setShowChat(true);
  };

  return (
    <div className={`tickets-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="container">
        <h2 className="page-title">
          🎟️ My Tickets
        </h2>

        {tickets.length === 0 ? (
          <p className="no-tickets">You haven’t purchased any tickets yet.</p>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket) => {
              const event = ticket.event;
              return (
                <div key={ticket._id} className="ticket-card">
                  {/* Event Creator */}
                  <div className="event-header">
                    {event.createdBy?.profilePic && (
                      <img
                        src={`/uploads/${event.createdBy.profilePic}`}
                        alt={event.createdBy?.username || "Creator"}
                        className="creator-avatar"
                      />
                    )}
                    <h3 className="event-title">{event.title}</h3>
                  </div>

                  {/* Event Image */}
                  {event.image && (
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL?.replace("/api", "") ||
                        "http://localhost:5000"
                      }/uploads/event_image/${event.image}`}
                      alt={event.title}
                      className="event-image"
                    />
                  )}

                  {/* Ticket Info */}
                  <div className="ticket-info">
                    <p>
                      <span>Quantity:</span> {ticket.quantity}
                    </p>
                    <p>
                      <span>Date:</span>{" "}
                      {new Date(event.date).toLocaleString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                      <span className="location"> • {event.location}</span>
                    </p>
                    <p>
                      <span>Price Paid:</span> ₦
                      {event.ticketPrice * ticket.quantity}
                    </p>
                  </div>

                  {/* Live Event */}
                  {event.liveStream?.isLive && (
                    <div className="live-section">
                      <span className="live-badge">🔴 LIVE NOW</span>
                      <button
                        onClick={() => handleJoinChat(event._id)}
                        className="join-btn"
                      >
                        Join Live Chat
                      </button>

                      {showChat && activeEventId === event._id && (
                        <div className="chat-wrapper">
                          <LiveChat
                            eventId={event._id}
                            username={user?.username || "Guest"}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* QR Code */}
                  {ticket.qrCode && (
                    <div className="qr-section">
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL?.replace("/api", "") ||
                          "http://localhost:5000"
                        }/uploads/${ticket.qrCode}`}
                        alt="Ticket QR Code"
                        className="qr-image"
                      />
                      <a
                        href={`${
                          import.meta.env.VITE_API_URL?.replace("/api", "") ||
                          "http://localhost:5000"
                        }/uploads/${ticket.qrCode}`}
                        download={`ticket-${ticket._id}.png`}
                        className="download-btn"
                      >
                        ⬇️ Download QR
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
