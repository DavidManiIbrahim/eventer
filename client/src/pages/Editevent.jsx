import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import "./CSS/EditEvent.css"; // ✅ Import dark mode CSS

export default function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    ticketPrice: "",
    totalTickets: "",
    streamType: "YouTube",
    streamURL: "",
  });

  useEffect(() => {
    API.get(`/events/${eventId}`)
      .then((res) => setForm(res.data))
      .catch((err) => console.error("Failed to load event", err));
  }, [eventId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/events/update/${eventId}`, form);
      alert("✅ Event updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update event");
    }
  };

  return (
    <div className="edit-event-page min-h-screen flex items-center justify-center p-6">
      <div className="edit-event-card w-full max-w-2xl rounded-2xl shadow-lg p-8">
        <h2 className="edit-event-title text-2xl font-bold mb-6 flex items-center gap-2">
          ✏️ Edit Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="form-label">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Event title"
              required
              className="form-input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Event description"
              required
              rows="4"
              className="form-input"
            />
          </div>

          {/* Location */}
          <div>
            <label className="form-label">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Event location"
              required
              className="form-input"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Time</label>
              <input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Ticket Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Ticket Price ($)</label>
              <input
                name="ticketPrice"
                type="number"
                value={form.ticketPrice}
                onChange={handleChange}
                placeholder="Enter ticket price"
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Total Tickets</label>
              <input
                name="totalTickets"
                type="number"
                value={form.totalTickets}
                onChange={handleChange}
                placeholder="Number of tickets"
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Streaming Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Stream Type</label>
              <select
                name="streamType"
                value={form.streamType}
                onChange={handleChange}
                className="form-input"
              >
                <option value="YouTube">YouTube</option>
                <option value="Facebook">Facebook</option>
              </select>
            </div>

            <div>
              <label className="form-label">Stream URL</label>
              <input
                name="streamURL"
                value={form.streamURL}
                onChange={handleChange}
                placeholder="Paste stream link"
                className="form-input"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button type="submit" className="submit-btn w-full py-3 font-semibold rounded-lg shadow-md transition">
              ✅ Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
