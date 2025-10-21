import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useState } from "react";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state || !state.event || !state.quantity || !state.user) {
    console.error("Invalid checkout state:", state);
    return (
      <p className="text-red-500 text-center mt-10">
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
        window.location.href = res.data.url; // Redirect to Paystack
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
    <div className="checkout-container min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="checkout-card bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 max-w-lg w-full border border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Checkout Confirmation
        </h1>

        {/* Event Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {event.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            📅 {new Date(event.startDate).toLocaleDateString()} • ⏰ {event.startTime}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">📍 {event.location}</p>
        </div>

        {/* Buyer Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Buyer Info</h3>
          <p className="text-gray-600 dark:text-gray-400">👤 {user.username}</p>
          <p className="text-gray-600 dark:text-gray-400">📧 {user.email}</p>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Order Summary</h3>
          <p className="text-gray-600 dark:text-gray-400">🧾 Quantity: {quantity}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
            💰 Total: ₦{totalAmount.toLocaleString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={handleConfirmPayment}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-medium shadow-md transition duration-200 
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
          >
            {loading ? "Processing..." : "✅ Confirm & Pay"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium shadow-md transition duration-200"
          >
            🔙 Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
