import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import LiveChat from "../components/LiveChats";
import { ThemeContext } from "../contexts/ThemeContexts";
import "./CSS/MyTickets.css";

const PORT_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [activeEventId, setActiveEventId] = useState(null);
  const { darkMode } = useContext(ThemeContext);
  const user = JSON.parse(localStorage.getItem("user"));

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
    <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="dashboard-container">
        <h2 className="dashboard-title">🎟️ My Tickets</h2>

        {tickets.length === 0 ? (
          <div className="dash-card center muted">
            You haven't purchased any tickets yet.
          </div>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket) => {
              const event = ticket?.event;
              if (!event) return null;

              // Calculate total price: either use ticket.amount (total paid) or ticket.price * quantity
              const totalPrice = ticket.amount || (ticket.price || 0) * (ticket.quantity || 1);
              const pricePerTicket = ticket.price || 0;

              return (
                <div key={ticket._id} className="ticket-card">
                  {/* Event Header */}
                  <div className="event-header">
                    {event.createdBy?.profilePic ? (
                      <img
                        src={`${PORT_URL}/uploads/profile_pic/${event.createdBy.profilePic}`}
                        alt={event.createdBy.username || "Creator"}
                        className="creator-avatar"
                      />
                    ) : (
                      <div className="avatar-fallback">
                        {event.createdBy?.username?.charAt(0) || "U"}
                      </div>
                    )}
                    <h3 className="event-title">{event.title}</h3>
                  </div>

                  {/* Event Image */}
                  {event.image && (
                    <img
                      src={`${PORT_URL}/uploads/event_image/${event.image}`}
                      alt={event.title}
                      className="event-image"
                    />
                  )}

                  {/* Ticket Info */}
                  <div className="ticket-info">
                    <p>
                      <span>Quantity:</span> {ticket.quantity || 1}
                    </p>
                    <p>
                      <span>Price per ticket:</span> ₦{pricePerTicket.toLocaleString()}
                    </p>
                    <p>
                      <span>Total Paid:</span> ₦{totalPrice.toLocaleString()}
                    </p>
                    <p>
                      <span>Ticket Type:</span> {ticket.pricingType || "Standard"}
                    </p>
                    <p>
                      <span>Purchase Date:</span>{" "}
                      {ticket.purchasedAt 
                        ? new Date(ticket.purchasedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                    <p>
                      <span>Event Date:</span>{" "}
                      {event.startDate
                        ? new Date(event.startDate).toLocaleString("en-US", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })
                        : "N/A"}{" "}
                      <span className="location">• {event.location}</span>
                    </p>
                    <p>
                      <span>Reference:</span> {ticket.reference || "N/A"}
                    </p>
                    <p>
                      <span>Status:</span>{" "}
                      <span className={`status-badge ${ticket.used ? "used" : "valid"}`}>
                        {ticket.used ? "✅ Used" : "✅ Valid"}
                      </span>
                    </p>
                  </div>

                  {/* Live Chat */}
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
                      <h4>Your Ticket QR Code:</h4>
                      <img
                        src={`${PORT_URL}/uploads/${ticket.qrCode}`}
                        alt="Ticket QR Code"
                        className="qr-image"
                      />
                      <div className="qr-actions">
                        <a
                          href={`${PORT_URL}/uploads/${ticket.qrCode}`}
                          download={`ticket-${ticket._id}.png`}
                          className="download-btn"
                        >
                          ⬇️ Download QR
                        </a>
                        <button
                          className="validate-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${PORT_URL}/tickets/validate/${ticket._id}`
                            );
                            alert("Validation link copied to clipboard!");
                          }}
                        >
                          📋 Copy Validate Link
                        </button>
                      </div>
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