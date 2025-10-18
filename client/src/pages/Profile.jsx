import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContexts";
import "./CSS/Profile.css";
import edit from "../components/EditProfile";

const PORT_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const { darkMode } = useContext(ThemeContext); // to re-render when theme changes

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [id]);

  if (!profile)
    return (
      <div className="flex flex-col items-center justify-center py-12 profile-container">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );

  return (
    <div
      className="min-h-screen pl-18 profile-container"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Cover + Profile Image */}
      <div className="relative">
        <img
          src="/cover.jpg"
          alt="cover"
          className="h-48 w-full object-cover shadow"
        />
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <img
            src={`${PORT_URL}/uploads/profile_pic/${profile.profilePic}`}
            alt="profile"
            className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="max-w-6xl mx-auto mt-20 px-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="">@{profile.username}</p>
            <p className="mt-2 text-gray-600">{profile.bio}</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary">Dashboard</button>
            <button className="btn-warning" onClick={edit}>
              Edit Profile
            </button>
          </div>
        </div>

        <hr className="my-8 divider" />

        {/* Toggle Tabs */}
        <div className="flex gap-4 tab-container p-3 rounded-lg">
          <button
            className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`tab-btn ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past
          </button>
          {(profile.role === "organizer" || profile.role === "admin") && (
            <button
              className={`tab-btn ${activeTab === "created" ? "active" : ""}`}
              onClick={() => setActiveTab("created")}
            >
              Created Events
            </button>
          )}
        </div>

        {/* Events Section */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeTab === "upcoming" &&
            (profile.tickets?.length ? (
              profile.tickets.map((event) => (
                <div key={event._id} className="event-card">
                  {event.image && (
                    <img
                      src={`${PORT_URL}/uploads/event_image/${event.image}`}
                      alt={event.title}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-sm mt-1">{event.description}</p>

                    <div className="mt-2 text-sm">📍 {event.location}</div>
                    <div className="mt-1 text-sm">
                      📅{" "}
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      {event.time && (
                        <span>
                          {" "}
                          at{" "}
                          {new Date(
                            `1970-01-01T${event.time}`
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 font-medium text-indigo-600">
                      🎟 ₦{event.ticketPrice}
                    </div>
                    <div className="text-xs">
                      Tickets Left:{" "}
                      {event.totalTickets - (event.ticketsSold || 0)}
                    </div>

                    <button className="mt-4 btn-primary w-full">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No upcoming events</p>
            ))}

          {activeTab === "created" &&
            (profile.createdEvents?.length ? (
              profile.createdEvents.map((event) => (
                <div key={event._id} className="event-card">
                  {event.image && (
                    <img
                      src={`${PORT_URL}/uploads/event_image/${event.image}`}
                      alt={event.title}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-sm mt-1">{event.description}</p>

                    <div className="mt-2 text-sm">📍 {event.location}</div>
                    <div className="mt-1 text-sm">
                      📅 {new Date(event.date).toLocaleDateString()} at{" "}
                      {event.time}
                    </div>

                    <div className="mt-2 font-medium text-indigo-600">
                      🎟 ₦{event.ticketPrice}
                    </div>
                    <div className="text-xs">
                      Tickets Left:{" "}
                      {event.totalTickets - (event.ticketsSold || 0)}
                    </div>

                    <button className="mt-4 btn-warning w-full">
                      Manage Event
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No created events</p>
            ))}
        </div>

        {activeTab === "past" && <p>No past events</p>}
      </div>
    </div>
  );
};

export default Profile;
