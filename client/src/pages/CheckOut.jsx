import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useState } from "react";
import "./CSS/checkout.css";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state || !state.event || !state.quantity || !state.user) {
    console.error("Invalid checkout state:", state);
    return (
      <p className="checkout-error">
        ❌ Error: Invalid checkout details.
      </p>
    );
  }

  const { event, quantity, user } = state;
  const selectedPrice = event.pricing?.[0]?.price || 0;
  const totalAmount = selectedPrice * quantity;

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      const res = await API.post("/payment/initiate", {
        email: user.email,
        amount: totalAmount,
        metadata: {
          eventId: event._id,
          userId: user._id,
          quantity,
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
    <div className="checkout-page">
      <div className="checkout-card">

        {/* Header */}
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Confirm your ticket purchase</p>
        </div>

        {/* Event */}
        <div className="checkout-section">
          <h2 className="checkout-title">{event.title}</h2>
          <p className="checkout-muted">{event.description}</p>

          <div className="checkout-meta">
            <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
            <span>⏰ {event.startTime}</span>
            <span>📍 {event.location}</span>
          </div>
        </div>

        {/* Buyer */}
        <div className="checkout-section">
          <h3>Buyer Info</h3>
          <p>👤 {user.username}</p>
          <p>📧 {user.email}</p>
        </div>

        {/* Summary */}
        <div className="checkout-summary">
          <div className="checkout-row">
            <span>Quantity</span>
            <strong>{quantity}</strong>
          </div>
          <div className="checkout-row total">
            <span>Total</span>
            <strong>₦{totalAmount.toLocaleString()}</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="checkout-actions">
          <button
            onClick={handleConfirmPayment}
            disabled={loading}
            className="checkout-pay-btn"
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="checkout-back-btn"
          >
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
}
