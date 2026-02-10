import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useState, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContexts";
import {
  CreditCard,
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  Clock,
  ShieldCheck,
  User
} from "lucide-react";
import "./CSS/checkout.css";

const PORT_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);

  if (!state || !state.event || !state.quantity || !state.user) {
    return (
      <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="checkout-error-container">
          <div className="error-card">
            <h2>Invalid Checkout Details</h2>
            <p>We couldn't retrieve the event details. Please try selecting your tickets again.</p>
            <button className="btn-primary" onClick={() => navigate("/events")}>
              Return to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { event, quantity, user } = state;
  const [selectedPricing, setSelectedPricing] = useState(event.pricing?.[0] || {});
  // If specific pricing was passed in state (e.g. from ticket selection), use that, otherwise default
  // Ideally, the previous page should pass the *specific* pricing selected if multiple exist.
  // For now, we'll assume standard flow or passed logic.

  const selectedPrice = state.price || selectedPricing.price || event.ticketPrice || 0;
  const pricingType = state.pricingType || selectedPricing.type || "Standard";

  const totalAmount = selectedPrice * quantity;

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      const userIdToSend = user._id || user.id || user.email;

      const res = await API.post("/payment/initiate", {
        email: user.email,
        amount: totalAmount,
        metadata: {
          eventId: event._id,
          userId: userIdToSend,
          quantity: quantity.toString(),
          price: selectedPrice.toString(),
          pricingType: pricingType,
        },
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        alert("⚠️ Unable to start payment. Try again later.");
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("⚠️ Payment failed to start. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="dashboard-container checkout-container">

        <div className="checkout-nav">
          <button className="back-link" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="checkout-page-title">Checkout</h1>
        </div>

        <div className="checkout-grid">
          {/* Left Column: Event Details */}
          <div className="checkout-details-col">
            <div className="checkout-card event-summary-card">
              <div className="event-cover-wrapper">
                {event.image ? (
                  <img
                    src={`${PORT_URL}/uploads/event_image/${event.image}`}
                    alt={event.title}
                    className="checkout-event-img"
                  />
                ) : (
                  <div className="checkout-event-placeholder" />
                )}
                <div className="event-summary-overlay">
                  <h2>{event.title}</h2>
                  <p className="organizer">by {event.createdBy?.username || "Organizer"}</p>
                </div>
              </div>

              <div className="event-info-grid">
                <div className="info-item">
                  <Calendar size={18} className="info-icon" />
                  <div>
                    <span className="label">Date</span>
                    <span className="value">
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        weekday: "short", month: "short", day: "numeric"
                      })}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <Clock size={18} className="info-icon" />
                  <div>
                    <span className="label">Time</span>
                    <span className="value">{event.startTime}</span>
                  </div>
                </div>
                <div className="info-item full-width">
                  <MapPin size={18} className="info-icon" />
                  <div>
                    <span className="label">Location</span>
                    <span className="value">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="checkout-card buyer-info-card">
              <h3><User size={18} /> Buyer Information</h3>
              <div className="buyer-details">
                <div className="detail-row">
                  <span>Name</span>
                  <strong>{user.name || user.username}</strong>
                </div>
                <div className="detail-row">
                  <span>Email</span>
                  <strong>{user.email}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Payment */}
          <div className="checkout-payment-col">
            <div className="checkout-card order-summary-card">
              <h3>Order Summary</h3>

              <div className="order-items">
                <div className="order-item">
                  <div className="item-info">
                    <span className="item-name">{pricingType} Ticket</span>
                    <span className="item-qty">x {quantity}</span>
                  </div>
                  <span className="item-price">₦{selectedPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="order-divider" />

              <div className="order-total">
                <span>Total</span>
                <span className="total-amount">₦{totalAmount.toLocaleString()}</span>
              </div>

              <div className="payment-security-note">
                <ShieldCheck size={16} />
                <span>Secure payment via Paystack</span>
              </div>

              <button
                className="btn-primary pay-btn"
                onClick={handleConfirmPayment}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-state">Processing...</span>
                ) : (
                  <>
                    PAY ₦{totalAmount.toLocaleString()} <CreditCard size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}