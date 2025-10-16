import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./CSS/CreateEvent.css";
import { ThemeContext } from "../contexts/ThemeContexts";

export default function CreateEvent({ isOpen, onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    streamType: "YouTube",
    streamURL: "",
    eventType: "In-person",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    pricing: [
      { type: "Regular", price: "" },
      { type: "VIP", price: "" },
      { type: "VVIP", price: "" },
    ],
    totalTickets: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Disable scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePricingChange = (index, value) => {
    const updatedPricing = [...form.pricing];
    updatedPricing[index].price = value;
    setForm((prev) => ({ ...prev, pricing: updatedPricing }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "pricing") formData.append(key, JSON.stringify(value));
        else formData.append(key, value);
      });
      if (imageFile) formData.append("image", imageFile);

      await API.post("/events/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Event created successfully!");
      navigate("/events");
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create event");
    }
  };

  return (
    <div
      className={`create-event-overlay ${darkMode ? "dark-mode" : ""}`}
      onClick={(e) => {
        if (e.target.classList.contains("create-event-overlay")) onClose();
      }}
    >
      <div className="create-event-container">
        <div className="form-wrapper">
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>

          <h2 className="form-title">🎉 Create New Event</h2>

          {/* Event Type Selection */}
          <div className="event-type-selection">
            {["In-person", "Virtual", "Hybrid"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, eventType: type }))
                }
                className={`event-type-btn ${
                  form.eventType === type ? "active" : ""
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <input
              name="title"
              placeholder="Event Name"
              className="input-field"
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Event Description"
              rows="4"
              className="input-field"
              onChange={handleChange}
              required
            ></textarea>

            <input
              name="category"
              placeholder="Category (e.g. Tech, Music, Business)"
              className="input-field"
              onChange={handleChange}
              required
            />

            {/* Date and Time */}
            <div className="date-time-row">
              <div>
                <label className="field-label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="field-label">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="field-label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="field-label">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <input
              name="location"
              placeholder="Event Location"
              className="input-field"
              onChange={handleChange}
              required
            />

            

            {/* Pricing */}
            <div className="pricing-section">
              <h3>💳 Pricing Categories</h3>
              {form.pricing.map((item, index) => (
                <div key={index} className="pricing-grid">
                  <span>{item.type}</span>
                  <input
                    type="number"
                    placeholder={`₦ ${item.type} Price`}
                    className="input-field"
                    value={item.price}
                    onChange={(e) => handlePricingChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <input
              name="totalTickets"
              type="number"
              placeholder="Total Tickets"
              className="input-field"
              onChange={handleChange}
              required
            />

            <label className="field-label">Stream Type</label>
            <select
              name="streamType"
              value={form.streamType}
              className="input-field"
              onChange={handleChange}
            >
              <option value="YouTube">YouTube</option>
              <option value="Facebook">Facebook</option>
            </select>

            <input
              name="streamURL"
              placeholder="Stream URL (optional)"
              className="input-field"
              onChange={handleChange}
            />

            {/* Image Upload */}
            <label htmlFor="imageUpload" className="upload-box">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
              ) : (
                <span className="upload-text">📸 Upload Event Image</span>
              )}
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <button type="submit" className="submit-btn">
              🚀 Create Event
            </button>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="info-sidebar">
          <img src="/event-illustration.svg" alt="Create event" />
          <h2>Create your event</h2>
          <p>
            Start creating your event by providing the basic details now and
            complete it later if needed.
          </p>
        </div>
      </div>
    </div>
  );
}
