import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth";
import { ThemeContext } from "../contexts/ThemeContexts";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Minimum 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSuccess("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.user, res.data.token);
      setSuccess("Login successful ✅ Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setErrors({
        general:
          err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
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
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              {errors.general}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-600 px-4 py-2 rounded-md text-sm">
              {success}
            </div>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className={`text-center text-sm mt-6 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Don’t have an account?{" "}
          <span
            className="text-indigo-500 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>

        
      </div>
    </div>
  );
}
