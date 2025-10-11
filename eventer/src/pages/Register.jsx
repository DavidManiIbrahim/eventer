import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContexts";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    isOrganizer: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setError("Only image files are allowed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", form.username.trim());
      formData.append("email", form.email.trim());
      formData.append("password", form.password);
      formData.append("isOrganizer", form.isOrganizer ? "true" : "false");

      await API.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Registered successfully ✅ Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl p-8 transition-all duration-300 ${
          theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl font-bold text-center mb-6 ${
            theme === "dark" ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-100 text-red-600 px-4 py-2 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-green-100 text-green-600 px-4 py-2 text-sm">
              {success}
            </div>
          )}

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "border-gray-300"
            }`}
          />

          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "border-gray-300"
            }`}
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "border-gray-300"
            }`}
          />

          <label
            className={`flex items-center space-x-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <input
              type="checkbox"
              name="isOrganizer"
              checked={form.isOrganizer}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-500 focus:ring-indigo-400 border-gray-300 rounded"
            />
            <span>I'm an Organizer</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 rounded-lg transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p
          className={`text-center text-sm mt-6 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Already have an account?{" "}
          <span
            className="text-indigo-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
