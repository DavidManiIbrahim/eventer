import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.event || !state.quantity || !state.user) {
    console.error("Invalid checkout state:", state);
    return (
      <p className="text-red-500 text-center mt-10">
        ❌ Error: Invalid checkout details.
      </p>
    );
  }

  const { event, quantity, user } = state;

const handleConfirmPayment = async () => {
  try {
    const res = await API.post("/payment/initiate", {
      email: user.email,
      amount: event.ticketPrice * quantity,
      metadata: { 
        eventId: event._id, 
        userId: user._id, 
        quantity 
      },
    });
    window.location.href = res.data.url; // Redirect to Paystack
  } catch (err) {
    console.error(err);
    alert("⚠️ Payment failed to start");
  }
};


  return (
    <div className="checkout-container min-h-screen flex items-center justify-center px-4">
      <div className="checkout-card shadow-xl rounded-2xl p-8 max-w-lg w-full">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-center checkout-title">
          Checkout Confirmation
        </h1>

        {/* Event Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold checkout-subtitle">
            {event.title}
          </h2>
          <p className="checkout-text mt-1">{event.description}</p>
          <p className="checkout-muted text-sm mt-2">
            📅 {new Date(event.date).toLocaleDateString()} at {event.time}
          </p>
          <p className="checkout-muted text-sm">📍 {event.location}</p>
        </div>

        {/* Buyer Info */}
        <div className="border-t border-gray-200 pt-4 mb-6 checkout-border">
          <h3 className="text-lg font-semibold checkout-subtitle">
            Buyer Info
          </h3>
          <p className="checkout-text">👤 {user.username}</p>
          <p className="checkout-text">📧 {user.email}</p>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-4 mb-6 checkout-border">
          <h3 className="text-lg font-semibold checkout-subtitle">
            Order Summary
          </h3>
          <p className="checkout-text">🧾 Quantity: {quantity}</p>
          <p className="checkout-total font-bold text-lg">
            💰 Total: ₦{event.ticketPrice * quantity}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-3">
          <button
            onClick={handleConfirmPayment}
            className="checkout-btn-confirm w-full py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            ✅ Confirm & Pay
          </button>
          <button
            onClick={() => navigate(-1)}
            className="checkout-btn-back w-full py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            🔙 Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
