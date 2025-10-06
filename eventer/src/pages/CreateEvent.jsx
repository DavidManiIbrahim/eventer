import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./CSS/CreateEvent.css";
import { ThemeContext } from "../contexts/ThemeContexts"; // 🌙 for dark mode toggle

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    ticketPrice: "",
    totalTickets: "",
    streamType: "YouTube",
    streamURL: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (imageFile) formData.append("image", imageFile);

      await API.post("/events/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Event created successfully!");
      navigate("/events");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create event");
    }
  };

  return (
    <div className={`create-event-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="form-wrapper">
        <h2 className="form-title">🎉 Create New Event</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <input
            name="title"
            placeholder="Event Title"
            className="input-field"
            onChange={handleChange}
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Event Description"
            rows="4"
            className="input-field"
            onChange={handleChange}
            required
          ></textarea>

          {/* Category, Date, Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="category"
              placeholder="Category"
              className="input-field"
              onChange={handleChange}
              required
            />
            <input
              name="date"
              type="date"
              className="input-field"
              onChange={handleChange}
              required
            />
            <input
              name="time"
              type="time"
              className="input-field"
              onChange={handleChange}
              required
            />
          </div>

          {/* Location & Image Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="location"
              placeholder="Event Location"
              className="input-field"
              onChange={handleChange}
              required
            />

            <label
              htmlFor="imageUpload"
              className="upload-box"
            >
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
          </div>

          {/* Ticket Price & Total Tickets */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="ticketPrice"
              type="number"
              placeholder="₦ Ticket Price"
              className="input-field"
              onChange={handleChange}
              required
            />
            <input
              name="totalTickets"
              type="number"
              placeholder="Total Tickets"
              className="input-field"
              onChange={handleChange}
              required
            />
          </div>

          {/* Stream Type */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
              Stream Type
            </label>
            <select
              name="streamType"
              value={form.streamType}
              className="input-field"
              onChange={handleChange}
            >
              <option value="YouTube">YouTube</option>
              <option value="Facebook">Facebook</option>
            </select>
          </div>

          {/* Stream URL */}
          <input
            name="streamURL"
            placeholder="Stream URL (optional)"
            className="input-field"
            onChange={handleChange}
          />

          {/* Submit */}
          <button type="submit" className="submit-btn">
            🚀 Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
