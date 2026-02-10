import { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { ThemeContext } from "../contexts/ThemeContexts";
import { useNavigate } from "react-router-dom";
import "./CSS/EditProfile.css";

// ✅ Server URL without /api suffix for static assets
const SERVER_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

export default function EditProfile() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewPic, setPreviewPic] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          name: res.data.name || "",
          username: res.data.username || "",
          bio: res.data.bio || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Normalize file path so images always render correctly
  const buildImageUrl = (path, type = "profile") => {
    if (!path) return "";
    // If already a full URL, return as-is
    if (/^https?:\/\//i.test(path)) return path;

    // strip leading slashes
    const normalized = path.replace(/^\/+/, "");

    // If path already references uploads/profile_pic or uploads/cover_pic or includes "uploads"
    if (
      normalized.startsWith("uploads") ||
      /profile_pic|cover_pic/.test(normalized)
    ) {
      return `${SERVER_URL}/${normalized}`;
    }

    // If backend returned just a filename (no slash), pick folder based on type
    if (!normalized.includes("/")) {
      if (type === "cover") return `${SERVER_URL}/uploads/cover_pic/${normalized}`;
      return `${SERVER_URL}/uploads/profile_pic/${normalized}`;
    }

    // Fallback: join with base URL
    return `${SERVER_URL}/${normalized}`;
  };


  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append(type, file); // 'profilePic' or 'coverPic'

    try {
      setLoading(true);
      const endpoint =
        type === "profilePic" ? "/profile/me/upload" : "/profile/me/cover";

      const res = await API.post(endpoint, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const objectUrl = URL.createObjectURL(file);

      if (type === "profilePic") {
        setPreviewPic(objectUrl);
        setUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
      } else {
        setPreviewCover(objectUrl);
        setUser((prev) => ({ ...prev, coverPic: res.data.coverPic }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await API.put("/profile/edit", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Profile updated successfully!");
      navigate("/profile/me");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user)
    return (
      <div className="editprofile-loading">
        <div className="spinner" />
        <p>Loading your profile...</p>
      </div>
    );

  return (
    <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="dashboard-container">
        <div className="edit-profile-card">
          <div className="card-header">
            <h1 className="page-title">Edit Profile</h1>
            <button className="btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>

          <div className="cover-section">
            <img
              src={previewCover || buildImageUrl(user.coverPic, "cover") || "/cover.jpg"}
              alt="Cover"
              className="cover-image"
            />
            <label htmlFor="coverPic" className="cover-upload-btn">
              {loading ? "Uploading..." : "Change Cover"}
              <input
                type="file"
                id="coverPic"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "coverPic")}
              />
            </label>

            <div className="profile-pic-wrapper">
              <img
                src={
                  previewPic ||
                  buildImageUrl(user.profilePic, "profile") ||
                  "/default-avatar.png"
                }
                alt="Profile"
                className="profile-pic"
              />
              <label htmlFor="profilePic" className="profile-upload-btn">
                📷
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "profilePic")}
                />
              </label>
            </div>
          </div>

          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="@username"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell the world about yourself..."
                rows="4"
                className="form-textarea"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
